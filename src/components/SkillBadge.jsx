import { motion } from 'framer-motion';

/** SkillBadge — Modern sleek skill badge / card */
export default function SkillBadge({ icon: Icon, label, color = 'var(--accent)' }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="crystal-card relative overflow-hidden flex items-center gap-3 px-4 py-2.5 group cursor-default transition-all duration-300 hover:border-white/25"
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none rounded-xl"
                style={{ background: color }}
            />
            <div className="relative z-10 flex items-center gap-2.5">
                {Icon && (
                    <Icon
                        className="text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                            color,
                            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.1))',
                        }}
                    />
                )}
                <span className="text-sm font-semibold text-txt-primary tracking-wide group-hover:text-white transition-colors">
                    {label}
                </span>
            </div>
        </motion.div>
    );
}
