import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    SiC,
    SiCss,
    SiReact,
    SiTypescript,
    SiHtml5,
    SiCplusplus,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiUnrealengine,
    SiGnubash,
} from 'react-icons/si';
import { PROFILE, PROOF_LINKS, SKILLS } from '../data/portfolioData';
import LinkIcon from './LinkIcon';
import LanyardCard from './LanyardCard';
import SkillBadge from './SkillBadge';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const chipVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const ctaVariants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const valueCardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.97, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function useTypingEffect(text, speed = 45, delay = 800) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        let timeout;
        let index = 0;

        const startTyping = () => {
            const type = () => {
                if (index < text.length) {
                    setDisplayed(text.slice(0, index + 1));
                    index++;
                    timeout = setTimeout(type, speed);
                } else {
                    setDone(true);
                }
            };
            type();
        };

        timeout = setTimeout(startTyping, delay);
        return () => clearTimeout(timeout);
    }, [text, speed, delay]);

    return { displayed, done };
}

const ICON_MAP = {
    SiC,
    SiCss,
    SiReact,
    SiTypescript,
    SiHtml5,
    SiCplusplus,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiUnrealengine,
    SiGnubash,
};

const VALUE_PILLS = [
    {
        title: 'Interfaces React',
        detail: 'Des pages rapides, propres et fluides sur mobile comme sur desktop.',
    },
    {
        title: 'Projets sur mesure',
        detail: 'Sites vitrines, outils web ou dashboards adaptes au besoin.',
    },
    {
        title: 'Suivi serieux',
        detail: 'Communication claire, iterations rapides et rendu maintenable.',
    },
];

export default function HomeSection({ lanyard }) {
    const isExternal = (url) => url.startsWith('http');
    const subtitle = useTypingEffect(PROFILE.subtitle);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 sm:gap-10 items-start"
        >
            <motion.div variants={item} className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-txt-secondary">
                    <span className="w-2 h-2 rounded-full bg-white/70" />
                    Portfolio personnel
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <motion.div
                            aria-hidden
                            className="absolute -left-10 top-0 w-28 h-28 rounded-full blur-3xl pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 68%)' }}
                            animate={{ x: [-8, 18, -8], y: [0, -12, 0], scale: [1, 1.12, 1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            aria-hidden
                            className="absolute right-0 top-6 w-24 h-24 rounded-full blur-[52px] pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(201,201,204,0.12) 0%, transparent 72%)' }}
                            animate={{ x: [10, -12, 10], y: [-4, 10, -4], scale: [1.05, 0.96, 1.05] }}
                            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div
                            className="absolute -inset-x-8 -inset-y-4 opacity-20 blur-3xl pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 70%)' }}
                        />
                        <motion.h1
                            className="relative text-4xl sm:text-6xl font-display font-bold tracking-tight silver-text-gradient"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {PROFILE.title}
                        </motion.h1>
                    </div>
                    <p className={`text-base sm:text-xl text-txt-secondary font-mono${!subtitle.done ? ' typing-cursor' : ''}`}>
                        {subtitle.displayed}
                    </p>
                    <p className="text-sm sm:text-base text-txt-secondary">
                        {PROFILE.identity} {PROFILE.studies}
                    </p>
                    <p className="text-sm sm:text-base text-txt-muted max-w-2xl leading-relaxed">
                        {PROFILE.summary}
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-2.5"
                >
                    {[PROFILE.location, PROFILE.availability].map((label) => (
                        <motion.span
                            key={label}
                            variants={chipVariants}
                            whileHover={{ y: -2, scale: 1.02 }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs border border-white/10 bg-white/[0.02] text-txt-secondary"
                        >
                            {label}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-3"
                >
                    {PROOF_LINKS.map((link) => (
                        <motion.a
                            key={link.label}
                            variants={ctaVariants}
                            whileHover={{ y: -3, scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            href={link.url}
                            target={isExternal(link.url) ? '_blank' : undefined}
                            rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${link.priority === 'primary'
                                ? 'bg-white text-black border-transparent hover:brightness-95'
                                : 'bg-transparent text-txt-secondary border-white/15 hover:text-txt-primary hover:border-white/30'
                                }`}
                            style={link.priority === 'primary'
                                ? { boxShadow: '0 12px 30px rgba(255,255,255,0.08)' }
                                : { backdropFilter: 'blur(10px)' }}
                        >
                            <LinkIcon name={link.icon} />
                            {link.label}
                        </motion.a>
                    ))}
                </motion.div>

                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-txt-muted">Ce que je peux livrer</p>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                        {VALUE_PILLS.map((pill) => (
                            <motion.div
                                key={pill.title}
                                variants={valueCardVariants}
                                whileHover={{ y: -5, scale: 1.015 }}
                                className="crystal-card card-spotlight shine-card p-4 min-h-[128px]"
                            >
                                <div className="relative z-10 space-y-2">
                                    <div className="w-10 h-px bg-gradient-to-r from-white/60 to-transparent" />
                                    <p className="text-sm font-display font-semibold text-txt-primary">{pill.title}</p>
                                    <p className="text-xs leading-relaxed text-txt-secondary">{pill.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-txt-muted">Technos que j utilise le plus</p>
                    <div className="flex flex-wrap gap-2.5">
                        {SKILLS.map((skill) => {
                            const Icon = ICON_MAP[skill.icon];
                            if (!Icon) return null;
                            return (
                                <SkillBadge
                                    key={skill.label}
                                    icon={Icon}
                                    label={skill.label}
                                    color={skill.color}
                                />
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-txt-muted">Presence Discord</p>
                <LanyardCard data={lanyard.data} loading={lanyard.loading} error={lanyard.error} />
            </motion.div>
        </motion.div>
    );
}
