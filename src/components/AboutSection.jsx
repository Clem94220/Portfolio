import { motion } from 'framer-motion';
import { PROFILE, TIMELINE } from '../data/portfolioData';
import SectionHeading from './SectionHeading';

const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const row = {
    hidden: { opacity: 0, x: -16, filter: 'blur(8px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutSection() {
    return (
        <div className="space-y-6">
            <SectionHeading
                title="Parcours"
                description="Un resume simple de mon parcours et de ma progression en dev."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5">
                <div className="crystal-card p-5 sm:p-6 space-y-4">
                    <h3 className="font-display text-lg text-txt-primary">A propos</h3>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                        {PROFILE.identity} {PROFILE.studies}
                    </p>
                    <p className="text-sm text-txt-secondary leading-relaxed">{PROFILE.summary}</p>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                        Mon objectif est simple: faire des interfaces propres, maintenables et fluides, sur mobile comme sur desktop.
                    </p>
                </div>

                <motion.div
                    variants={list}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="crystal-card p-5 sm:p-6"
                >
                    <ol className="space-y-4">
                        {TIMELINE.map((item) => (
                            <motion.li key={`${item.period}-${item.title}`} variants={row} className="relative pl-5">
                                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-white/70" />
                                <p className="text-xs uppercase tracking-wider text-txt-muted">{item.period}</p>
                                <h4 className="text-sm sm:text-base font-semibold text-txt-primary mt-0.5">{item.title}</h4>
                                <p className="text-sm text-txt-secondary mt-1 leading-relaxed">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2 py-1 rounded-md text-[11px] border border-white/10 bg-white/[0.02] text-txt-muted"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.li>
                        ))}
                    </ol>
                </motion.div>
            </div>
        </div>
    );
}
