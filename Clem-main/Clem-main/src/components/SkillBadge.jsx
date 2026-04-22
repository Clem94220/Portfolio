import { motion } from 'framer-motion';

/** SkillBadge — Crystal theme skill badge */
export default function SkillBadge({ icon: Icon, label, color = 'var(--accent)' }) {
    return (
        <motion.div
            whileHover={{ scale: 1.08, y: -2 }}
            className="crystal-card flex items-center gap-2.5 px-4 py-2.5 group cursor-default"
        >
            <div className="relative z-10 flex items-center gap-2.5">
                <Icon
                    className="text-xl transition-all group-hover:drop-shadow-[0_0_6px_var(--accent-glow)]"
                    style={{ color }}
                />
                <span className="text-sm text-txt-secondary font-medium">{label}</span>
            </div>
        </motion.div>
    );
}
