import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed right-4 bottom-20 sm:bottom-16 z-50 w-10 h-10 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-txt-secondary hover:text-txt-primary hover:border-white/35 transition-colors"
                    style={{ background: 'rgba(7, 9, 12, 0.75)' }}
                    aria-label="Retour en haut"
                    title="Retour en haut"
                >
                    <FaArrowUp className="text-sm" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
