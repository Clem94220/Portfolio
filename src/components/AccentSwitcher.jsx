import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette } from 'react-icons/fa';

const ACCENTS = {
    white: { name: 'White', accent: '#ffffff', glow: 'rgba(255, 255, 255, 0.35)', subtle: 'rgba(255, 255, 255, 0.08)' },
    red: { name: 'Valorant', accent: '#ff4655', glow: 'rgba(255, 70, 85, 0.35)', subtle: 'rgba(255, 70, 85, 0.08)' },
    blue: { name: 'Fortnite', accent: '#00b4ff', glow: 'rgba(0, 180, 255, 0.35)', subtle: 'rgba(0, 180, 255, 0.08)' },
    orange: { name: 'Overwatch', accent: '#ff981f', glow: 'rgba(255, 152, 31, 0.35)', subtle: 'rgba(255, 152, 31, 0.08)' },
    purple: { name: 'Neon', accent: '#b88dfa', glow: 'rgba(184, 141, 250, 0.35)', subtle: 'rgba(184, 141, 250, 0.08)' }
};

const ACCENT_KEYS = Object.keys(ACCENTS);

export default function AccentSwitcher() {
    const [activeColor, setActiveColor] = useState('white');
    const [expanded, setExpanded] = useState(false);

    // Apply color values to document element variables
    const applyColor = useCallback((key) => {
        const theme = ACCENTS[key] || ACCENTS.white;
        const root = document.documentElement;
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-glow', theme.glow);
        root.style.setProperty('--accent-subtle', theme.subtle);
        localStorage.setItem('accent_color', key);
        setActiveColor(key);
    }, []);

    // Load active theme color from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('accent_color');
        if (saved && ACCENTS[saved]) {
            applyColor(saved);
        } else {
            applyColor('white');
        }
    }, [applyColor]);

    // Listen to cycle-accent custom events for keyboard shortcut mapping
    useEffect(() => {
        const handleCycle = () => {
            setActiveColor((prev) => {
                const currentIndex = ACCENT_KEYS.indexOf(prev);
                const nextIndex = (currentIndex + 1) % ACCENT_KEYS.length;
                const nextKey = ACCENT_KEYS[nextIndex];
                applyColor(nextKey);
                return nextKey;
            });
        };
        window.addEventListener('cycle-accent', handleCycle);
        return () => window.removeEventListener('cycle-accent', handleCycle);
    }, [applyColor]);

    return (
        <div className="fixed bottom-4 left-16 z-50 flex items-center gap-2">
            <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setExpanded(!expanded)}
                className="crystal-card w-10 h-10 flex items-center justify-center text-txt-secondary hover:text-txt-primary transition-colors cursor-none"
                style={{ borderColor: expanded ? 'var(--border-highlight)' : 'var(--border-crystal)' }}
                title="Change theme color"
                aria-label="Change theme color"
            >
                <FaPalette className="text-xs" />
            </motion.button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="crystal-card flex items-center gap-2.5 p-2.5 h-10"
                    >
                        {ACCENT_KEYS.map((key) => {
                            const info = ACCENTS[key];
                            const isActive = activeColor === key;
                            return (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.25 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => applyColor(key)}
                                    className="w-[18px] h-[18px] rounded-full relative flex items-center justify-center transition-shadow cursor-none"
                                    style={{
                                        backgroundColor: info.accent,
                                        boxShadow: isActive ? `0 0 10px ${info.accent}` : 'none',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                    title={info.name}
                                    aria-label={`Switch to ${info.name} theme`}
                                >
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
