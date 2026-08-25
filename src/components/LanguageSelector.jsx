import { motion } from 'framer-motion';

export default function LanguageSelector({ onSelect }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 15 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="crystal-card p-6 sm:p-8 w-full max-w-md text-center space-y-6 relative overflow-hidden border border-white/10"
                style={{ background: 'rgba(5, 7, 9, 0.88)' }}
            >
                {/* Subtle backglow */}
                <div
                    className="absolute -inset-x-20 -inset-y-20 opacity-20 blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 70%)' }}
                />

                <div className="space-y-2 relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold silver-text-gradient tracking-tight">
                        Clem
                    </h2>
                    <p className="text-xs uppercase tracking-[0.25em] text-txt-muted font-mono">
                        Welcome / Bienvenue
                    </p>
                </div>

                <div className="space-y-4 relative z-10">
                    <p className="text-sm text-txt-secondary leading-relaxed font-mono">
                        Choose your language / Choisissez votre langue
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button
                            onClick={() => onSelect('fr')}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 text-txt-primary hover:text-white transition-all group relative overflow-hidden"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🇫🇷</span>
                            <span className="text-xs sm:text-sm font-semibold font-display tracking-wider uppercase">Français</span>
                        </button>
                        <button
                            onClick={() => onSelect('en')}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 text-txt-primary hover:text-white transition-all group relative overflow-hidden"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🇬🇧</span>
                            <span className="text-xs sm:text-sm font-semibold font-display tracking-wider uppercase">English</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
