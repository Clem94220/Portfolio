import { motion } from 'framer-motion';
import { GAMING } from '../data/portfolioData';
import SectionHeading from './SectionHeading';

const GAME_COLORS = {
    Overwatch: { color: 'rgba(255, 152, 31, 0.5)', glow: 'rgba(255, 152, 31, 0.12)' },
    Fortnite: { color: 'rgba(147, 130, 255, 0.5)', glow: 'rgba(147, 130, 255, 0.12)' },
    Valorant: { color: 'rgba(255, 70, 85, 0.5)', glow: 'rgba(255, 70, 85, 0.12)' },
    'Forza Horizon 5': { color: 'rgba(0, 180, 255, 0.5)', glow: 'rgba(0, 180, 255, 0.12)' },
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function GamingSection() {
    return (
        <div className="space-y-6">
            <SectionHeading
                title="Gaming"
                description="Le gaming competitif m a aide a developper des reflexes utiles en dev: analyse, adaptation et execution."
            />

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {GAMING.map((entry) => {
                    const colors = GAME_COLORS[entry.title] || { color: 'rgba(255,255,255,0.3)', glow: 'rgba(255,255,255,0.08)' };
                    return (
                        <motion.article
                            key={entry.title}
                            variants={item}
                            whileHover={{ y: -6, scale: 1.03 }}
                            className="crystal-card game-glow p-4 sm:p-5 space-y-3 group"
                            style={{
                                '--game-color': colors.color,
                                '--game-glow': colors.glow,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={entry.image}
                                        alt={entry.title}
                                        className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"
                                        style={{ background: colors.glow }}
                                    />
                                </div>
                                <h3 className="text-base font-semibold text-txt-primary">{entry.title}</h3>
                            </div>
                            <p className="text-sm text-txt-secondary leading-relaxed">{entry.detail}</p>
                        </motion.article>
                    );
                })}
            </motion.div>
        </div>
    );
}
