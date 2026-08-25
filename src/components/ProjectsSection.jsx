import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaDiscord, FaGlobe } from 'react-icons/fa';
import { PROJECTS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function ProjectCard({ project }) {
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const tiltDataRef = useRef({ rX: 0, rY: 0 });
    const { t } = useTranslation();

    const handleMouseMove = useCallback((event) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - rect.width / 2;
        const mouseY = event.clientY - rect.top - rect.height / 2;

        tiltDataRef.current.rX = -(mouseY / (rect.height / 2)) * 5;
        tiltDataRef.current.rY = (mouseX / (rect.width / 2)) * 5;

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                const el = cardRef.current;
                if (el) {
                    const { rX, rY } = tiltDataRef.current;
                    el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
                    el.style.zIndex = '20';
                }
                rafRef.current = null;
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        const el = cardRef.current;
        if (el) {
            el.style.transition = 'transform 0.4s ease-out';
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            el.style.zIndex = '';
            setTimeout(() => {
                if (el) el.style.transition = '';
            }, 400);
        }
    }, []);

    // Action button setup (Website or Discord)
    const isDiscordAction = project.actionType === 'discord';
    const ActionIcon = isDiscordAction ? FaDiscord : FaGlobe;
    const actionLabel = project.actionLabel || (isDiscordAction ? t.common.discordInvite : t.common.website);

    return (
        <motion.article
            ref={cardRef}
            variants={item}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="crystal-card shine-card overflow-hidden h-full flex flex-col justify-between"
        >
            <div>
                <div className="h-40 overflow-hidden border-b border-white/10 bg-black/30 relative">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-xl font-display font-bold text-txt-primary">{project.title}</h3>
                        <p className="text-sm text-txt-secondary leading-relaxed">{project.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border border-white/10 bg-white/[0.02] text-txt-secondary"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <p className="text-xs text-txt-muted font-mono">{project.impact}</p>
                </div>
            </div>

            <div className="p-5 sm:p-6 pt-0 mt-auto flex gap-3">
                {/* Button 1: GitHub Repo */}
                <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-txt-secondary hover:text-txt-primary hover:border-white/35 bg-white/[0.02] hover:bg-white/[0.06] transition-all"
                >
                    <FaGithub className="text-sm sm:text-base" />
                    {t.common?.repo || 'GitHub'}
                </a>

                {/* Button 2: Website (Crystal) or Discord (R&D) */}
                <a
                    href={project.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold font-display uppercase tracking-wider transition-all ${
                        isDiscordAction
                            ? 'bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-[0_0_16px_rgba(88,101,242,0.3)]'
                            : 'bg-white hover:brightness-95 text-black shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                    }`}
                >
                    <ActionIcon className="text-sm sm:text-base" />
                    {actionLabel}
                </a>
            </div>
        </motion.article>
    );
}

export default function ProjectsSection() {
    const { t } = useTranslation();

    const projectsData = PROJECTS.map((project, index) => {
        const trans = t.projects ? t.projects[index] : null;
        return {
            ...project,
            title: trans ? trans.title : project.title,
            summary: trans ? trans.summary : project.summary,
            impact: trans ? trans.impact : project.impact,
            actionLabel: trans?.actionLabel || project.actionLabel,
        };
    });

    return (
        <div className="space-y-6">
            <SectionHeading
                title={t.nav.projects}
                description={
                    t.language === 'en'
                        ? 'Key software and development projects delivered.'
                        : 'Projets clés en développement et logiciels livrés.'
                }
            />

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
            >
                {projectsData.map((project) => (
                    <ProjectCard
                        key={project.id || project.title}
                        project={project}
                    />
                ))}
            </motion.div>
        </div>
    );
}
