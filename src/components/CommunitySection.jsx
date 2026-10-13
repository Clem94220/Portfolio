import { motion } from 'framer-motion';
import { STAFF_SERVERS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';

const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function CommunitySection() {
    const { t } = useTranslation();

    return (
        <div className="space-y-10">
            <SectionHeading
                title={t.community.headingTitle}
                description={t.community.headingDesc}
            />

            {/* Past Staff Experiences */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-display text-txt-secondary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        {t.community.staffServers}
                    </h3>
                    <span className="text-xs text-txt-muted font-mono">
                        {t.community.staffServersNote}
                    </span>
                </div>

                <motion.div
                    variants={list}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {STAFF_SERVERS.map((server) => (
                        <motion.article
                            key={server.name}
                            variants={item}
                            whileHover={{ y: -3, scale: 1.01 }}
                            className="crystal-card p-5 flex items-center gap-4 group transition-all"
                        >
                            <img
                                src={server.icon}
                                alt={server.name}
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-white/25 transition-all"
                                loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                                <span className="text-base font-bold font-display text-txt-primary block truncate">
                                    {server.name}
                                </span>
                                <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.02] text-txt-muted mt-1">
                                    {t.community.pastStaffRole || 'Ancien Staff'}
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
