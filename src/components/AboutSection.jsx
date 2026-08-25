import { motion } from 'framer-motion';
import { PROFILE, TIMELINE } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';

const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const row = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutSection() {
    const { t, language } = useTranslation();

    const timelineData = TIMELINE.map((item, index) => {
        const trans = t.about.timeline[index];
        let period = item.period;
        if (language === 'en') {
            if (period === '2024 - Aujourd hui') period = '2024 - Present';
            else if (period === 'Continu') period = 'Ongoing';
        }
        return {
            ...item,
            period,
            title: trans ? trans.title : item.title,
            description: trans ? trans.description : item.description,
        };
    });

    return (
        <div className="space-y-6">
            <SectionHeading
                title={t.about.headingTitle}
                description={t.about.headingDesc}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5">
                <div className="crystal-card p-5 sm:p-6 space-y-4">
                    <h3 className="font-display text-lg text-txt-primary">{t.about.cardTitle}</h3>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                        {t.profile.identity} {t.profile.studies}
                    </p>
                    <p className="text-sm text-txt-secondary leading-relaxed">{t.profile.summary}</p>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                        {t.about.cardTextExtra}
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
                        {timelineData.map((item) => (
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
