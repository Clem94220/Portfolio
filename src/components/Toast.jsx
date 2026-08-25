import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

export default function Toast() {
    const { toasts } = useToast();

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.95 }}
                        className="px-4 py-2 rounded-lg backdrop-blur-xl border border-white/15 text-sm shadow-lg pointer-events-auto"
                        style={{ background: 'rgba(12,14,18,0.84)', color: 'var(--text-primary)' }}
                    >
                        {toast.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
