import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { emitAudioReactiveState } from '../lib/audioReactive';

export default function MusicPlayer() {
    const audioRef = useRef(null);
    const containerRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const frequencyDataRef = useRef(null);
    const analysisFrameRef = useRef(null);
    const reactiveStateRef = useRef({
        playing: false,
        muted: false,
        volume: 0.25,
    });

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.25);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const pushReactiveState = useCallback(({ intensity = 0, bass = 0, volume: level = 0 } = {}) => {
        const { playing: isPlaying, muted: isMuted, volume: currentVolume } = reactiveStateRef.current;
        const active = isPlaying && !isMuted && currentVolume > 0.01;
        const boostedIntensity = Math.min(1, intensity * (0.9 + currentVolume * 1.2));
        const boostedBass = Math.min(1, bass * (0.85 + currentVolume * 1.2));
        const boostedVolume = Math.min(1, level * (0.85 + currentVolume * 1.0));

        emitAudioReactiveState({
            playing: active,
            intensity: active ? Math.max(0.08, boostedIntensity) : 0,
            bass: active ? Math.max(0.05, boostedBass) : 0,
            volume: active ? Math.max(0.12, boostedVolume) : 0,
        });
    }, []);

    const stopAnalysisLoop = useCallback(() => {
        if (analysisFrameRef.current !== null) {
            cancelAnimationFrame(analysisFrameRef.current);
            analysisFrameRef.current = null;
        }
    }, []);

    const startAnalysisLoop = useCallback(() => {
        if (analysisFrameRef.current !== null) return;
        if (!analyserRef.current || !frequencyDataRef.current) return;

        const sample = () => {
            const analyser = analyserRef.current;
            const data = frequencyDataRef.current;

            if (!analyser || !data) {
                analysisFrameRef.current = null;
                return;
            }

            analyser.getByteFrequencyData(data);

            const bucketCount = Math.max(12, Math.floor(data.length * 0.45));
            const bassCount = 4; // Bins 0-3 represent the deep bass better on a 256 FFT
            let weightedSum = 0;
            let weightTotal = 0;
            let bassSum = 0;
            let peak = 0;

            for (let i = 0; i < bucketCount; i++) {
                const value = data[i];
                const weight = 1.35 - (i / bucketCount) * 0.72;

                weightedSum += value * weight;
                weightTotal += weight;
                peak = Math.max(peak, value / 255);

                if (i < bassCount) {
                    bassSum += value;
                }
            }

            const normalized = weightTotal > 0 ? weightedSum / (255 * weightTotal) : 0;
            const bassLevel = bassCount > 0 ? bassSum / (255 * bassCount) : 0;
            const combined = Math.min(1, normalized * 0.8 + bassLevel * 0.4 + peak * 0.2);

            pushReactiveState({
                intensity: combined,
                bass: bassLevel,
                volume: normalized,
            });
            analysisFrameRef.current = requestAnimationFrame(sample);
        };

        analysisFrameRef.current = requestAnimationFrame(sample);
    }, [pushReactiveState]);

    const setupAudioAnalysis = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return false;

        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return false;

        if (!audioContextRef.current) {
            const context = new AudioContextCtor();
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.45; // Faster response to transients

            const source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);

            audioContextRef.current = context;
            analyserRef.current = analyser;
            sourceNodeRef.current = source;
            frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
        }

        if (audioContextRef.current.state === 'suspended') {
            try {
                await audioContextRef.current.resume();
            } catch {
                return false;
            }
        }

        startAnalysisLoop();
        return true;
    }, [startAnalysisLoop]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };

        if (expanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [expanded]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.loop = true;
        audio.volume = muted ? 0 : volume;
    }, [volume, muted]);

    useEffect(() => {
        reactiveStateRef.current.volume = volume;
        reactiveStateRef.current.muted = muted;
        pushReactiveState();
    }, [muted, pushReactiveState, volume]);

    useEffect(() => {
        reactiveStateRef.current.playing = playing;

        if (!playing) {
            stopAnalysisLoop();
            emitAudioReactiveState({ playing: false, intensity: 0, bass: 0, volume: 0 });

            if (audioContextRef.current?.state === 'running') {
                audioContextRef.current.suspend().catch(() => { });
            }
            return;
        }

        // Start the background motion immediately when playback begins,
        // even before the analyser has enough samples to produce a strong signal.
        emitAudioReactiveState({ playing: true, intensity: 0.22, bass: 0, volume: 0.32 });

        setupAudioAnalysis().then((ready) => {
            if (!ready) {
                pushReactiveState({ intensity: 0.18, bass: 0.1, volume: 0.16 });
            }
        });
    }, [playing, pushReactiveState, setupAudioAnalysis, stopAnalysisLoop]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Try immediate autoplay first
        audio.play()
            .then(() => setPlaying(true))
            .catch(() => {
                // If blocked, wait for first user interaction globally
                const playOnInteraction = () => {
                    audio.play().then(() => {
                        setPlaying(true);
                        setupAudioAnalysis().catch(() => { });
                        // Clean up listeners once playing
                        ['click', 'scroll', 'touchstart', 'keydown'].forEach(event =>
                            document.removeEventListener(event, playOnInteraction)
                        );
                    }).catch(() => { });
                };

                ['click', 'scroll', 'touchstart', 'keydown'].forEach(event =>
                    document.addEventListener(event, playOnInteraction)
                );
            });
    }, [setupAudioAnalysis]);

    useEffect(() => {
        return () => {
            stopAnalysisLoop();
            emitAudioReactiveState({ playing: false, intensity: 0, bass: 0, volume: 0 });

            if (sourceNodeRef.current) {
                sourceNodeRef.current.disconnect();
                sourceNodeRef.current = null;
            }

            if (analyserRef.current) {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            }

            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => { });
                audioContextRef.current = null;
            }
        };
    }, [stopAnalysisLoop]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => {
                setPlaying(true);
                setupAudioAnalysis().catch(() => { });
            }).catch(() => { });
        } else {
            audio.pause();
            setPlaying(false);
        }
    }, [setupAudioAnalysis]);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setDuration(audio.duration || 0);
    };

    const handleSeek = (event) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const value = parseFloat(event.target.value);
        audio.currentTime = value;
        setCurrentTime(value);
    };

    const handleVolume = (event) => {
        const value = parseFloat(event.target.value);
        setVolume(value);
        if (value > 0 && muted) setMuted(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.src = url;
        audio.load();
        
        // Handle autoplay logic for the new file
        audio.play().then(() => {
            setPlaying(true);
            setupAudioAnalysis().catch(() => {});
        }).catch(() => {
            setPlaying(false);
        });
    };

    const formatTime = (timeValue) => {
        if (!timeValue || Number.isNaN(timeValue)) return '0:00';
        const minutes = Math.floor(timeValue / 60);
        const seconds = Math.floor(timeValue % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="/assets/musique.mp3"
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
            />

            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start gap-2"
            >
                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setExpanded((state) => !state)}
                    className="crystal-card w-10 h-10 flex items-center justify-center"
                    style={{ borderColor: playing ? 'var(--border-highlight)' : 'var(--border-crystal)' }}
                    title="Lecteur musique"
                    aria-label="Lecteur musique"
                >
                    {playing ? <FaPause className="text-[11px] text-txt-primary" /> : <FaPlay className="text-[11px] text-txt-secondary" />}
                </motion.button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            className="crystal-card p-3.5 w-[calc(100vw-32px)] max-w-[270px] mb-2"
                        >
                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-[0.15em] font-mono text-txt-muted">Musique</span>
                                    <span className="text-[11px] font-mono text-txt-muted">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                                        aria-label={playing ? 'Pause' : 'Play'}
                                    >
                                        {playing ? <FaPause className="text-xs" /> : <FaPlay className="text-xs" />}
                                    </button>

                                    <input
                                        type="range"
                                        min={0}
                                        max={duration || 0}
                                        step={0.1}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="music-range flex-1 h-1"
                                        style={{
                                            background: `linear-gradient(to right, var(--accent) ${(currentTime / (duration || 1)) * 100}%, var(--border-crystal) ${(currentTime / (duration || 1)) * 100}%)`,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setMuted((state) => !state)}
                                        className="text-sm"
                                        style={{ color: muted ? 'var(--text-muted)' : 'var(--accent)' }}
                                        aria-label={muted ? 'Unmute' : 'Mute'}
                                    >
                                        {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={muted ? 0 : volume}
                                        onChange={handleVolume}
                                        className="music-range flex-1 h-1"
                                        style={{
                                            background: `linear-gradient(to right, var(--accent) ${(muted ? 0 : volume) * 100}%, var(--border-crystal) ${(muted ? 0 : volume) * 100}%)`,
                                        }}
                                    />
                                </div>

                                <div className="pt-1 border-t border-[var(--border-crystal)] pt-2">
                                    <input
                                        type="file"
                                        id="audio-upload"
                                        accept="audio/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <label
                                        htmlFor="audio-upload"
                                        className="w-full py-1.5 px-3 rounded-md text-[10px] font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--txt-muted)', border: '1px dashed var(--border-crystal)' }}
                                    >
                                        <span>CHARGER VOTRE MUSIQUE (.MP3)</span>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
