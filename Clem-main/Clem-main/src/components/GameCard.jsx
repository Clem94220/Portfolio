import { motion } from 'framer-motion';
import SafeImage from './SafeImage';

export default function GameCard({ icon: Icon, logoUrl, name, stat, color = 'var(--accent)' }) {
    return (
        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="crystal-card p-5 group relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    {logoUrl ? (
                        <SafeImage
                            src={logoUrl}
                            alt={name}
                            className="w-8 h-8 object-contain flex-shrink-0 transition-all group-hover:drop-shadow-[0_0_8px_var(--accent-glow)]"
                            fallbackClassName="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0"
                            fallbackLabel={name}
                        />
                    ) : Icon ? (
                        <Icon
                            className="text-2xl flex-shrink-0 transition-all group-hover:drop-shadow-[0_0_8px_var(--accent-glow)]"
                            style={{ color }}
                        />
                    ) : null}
                    <h4 className="text-txt-primary font-semibold text-base">{name}</h4>
                </div>
                {stat && <p className="text-txt-secondary text-sm">{stat}</p>}
            </div>
        </motion.div>
    );
}
