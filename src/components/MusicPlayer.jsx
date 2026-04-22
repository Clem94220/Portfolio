import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

export default function MusicPlayer() {
    const audioRef = useRef(null);
    const containerRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.25);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [expanded, setExpanded] = useState(false);

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
    }, []);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => setPlaying(true)).catch(() => { });
        } else {
            audio.pause();
            setPlaying(false);
        }
    }, []);

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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
