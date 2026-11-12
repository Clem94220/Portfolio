import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useTranslation } from '../contexts/LanguageContext';
import { useHideOnScroll } from '../hooks/useHideOnScroll';

export default function MusicPlayer() {
    const { t, language } = useTranslation();
    const audioRef = useRef(null);
    const containerRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.25);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const hideOnScroll = useHideOnScroll();

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

    useEffect(() => {
        const handleToggle = () => {
            togglePlay();
        };
        window.addEventListener('toggle-music', handleToggle);
        return () => window.removeEventListener('toggle-music', handleToggle);
    }, [togglePlay]);

    const handleTimeUpdate = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTime(audio.currentTime);
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        setDuration(audio.duration || 0);
    }, []);

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

            <m.div
                ref={containerRef}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className={`fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start gap-2 floating-widget ${hideOnScroll && !expanded ? 'is-hidden' : ''}`}
            >
                <m.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setExpanded((state) => !state)}
                    className="crystal-card w-11 h-11 flex items-center justify-center transition-all"
                    style={{
                        borderColor: playing ? 'var(--accent)' : 'var(--border-crystal)',
                        boxShadow: playing ? '0 0 12px var(--accent-glow)' : 'none'
                    }}
                    title={t.common.musicPlayer}
                    aria-label={t.common.musicPlayer}
                >
                    {playing ? (
                        <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 justify-center" aria-hidden="true">
                            <span className="w-[2.5px] rounded-full bg-[var(--accent)] animate-[soundbar-1_0.75s_ease-in-out_infinite]" />
                            <span className="w-[2.5px] rounded-full bg-[var(--accent)] animate-[soundbar-2_0.6s_ease-in-out_infinite]" />
                            <span className="w-[2.5px] rounded-full bg-[var(--accent)] animate-[soundbar-3_0.85s_ease-in-out_infinite]" />
                        </div>
                    ) : (
                        <FaPlay className="text-[10px] text-txt-secondary ml-0.5" />
                    )}
                </m.button>

                <AnimatePresence>
                    {expanded && (
                        <m.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            className="crystal-card p-3.5 w-[calc(100vw-32px)] max-w-[270px] mb-2"
                        >
                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-[0.15em] font-mono text-txt-muted">{t.common.music}</span>
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

                                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-txt-muted">
                                    <span>{language === 'en' ? 'Shortcut' : 'Raccourci'}</span>
                                    <span className="inline-flex items-center gap-1.5 text-txt-secondary">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono text-txt-primary">M</kbd>
                                        <span>{playing ? (language === 'en' ? 'Mute' : 'Couper') : (language === 'en' ? 'Play' : 'Relancer')}</span>
                                    </span>
                                </div>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </m.div>
        </>
    );
}
