import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
    const [visible, setVisible] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadingOut(true), 900);
        const removeTimer = setTimeout(() => setVisible(false), 1450);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ease-out ${
                fadingOut ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
            style={{ background: 'var(--bg-void)' }}
            aria-hidden={fadingOut}
        >
            <motion.h1
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl font-display font-bold silver-text-gradient mb-6"
            >
                Clem
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-xs uppercase tracking-[0.3em] text-txt-muted font-mono mb-8"
            >
                Loading portfolio
            </motion.p>

            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="loader-dot w-1.5 h-1.5 rounded-full bg-white/70"
                    />
                ))}
            </div>
        </div>
    );
}
