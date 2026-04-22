import { motion } from 'framer-motion';

export default function NeonHud({ totalViews, activeNow }) {
    return (
        <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.45 }}
            className="fixed bottom-4 right-4 z-50 p-2 min-w-[110px] rounded-lg backdrop-blur-md border border-white/10 pointer-events-none"
            style={{ background: 'rgba(8,10,14,0.52)' }}
            aria-hidden
        >
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    <span className="text-[10px] uppercase tracking-wider font-mono text-txt-muted">Live</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-txt-muted">Views</span>
                    <span className="text-[11px] font-mono text-txt-secondary tabular-nums">
                        {totalViews.toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-txt-muted">Active</span>
                    <span className="text-[11px] font-mono text-txt-secondary tabular-nums">{activeNow}</span>
                </div>
            </div>
        </motion.aside>
    );
}
