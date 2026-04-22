import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function PageLoader() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 900);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: 'var(--bg-void)' }}
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
                </motion.div>
            )}
        </AnimatePresence>
    );
}
