import { motion } from 'framer-motion';
import { SiHtml5, SiCss, SiJavascript, SiPython, SiReact, SiTypescript, SiCplusplus, SiNodedotjs, SiTailwindcss, SiUnrealengine, SiGnubash } from 'react-icons/si';
import { FaSkullCrossbones, FaMicrochip, FaMemory, FaDesktop, FaHdd, FaTerminal } from 'react-icons/fa';
import LanyardCard from './LanyardCard';
import SkillBadge from './SkillBadge';
import GameCard from './GameCard';

/* ── Shared animation variants ── */
const sectionStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
/* Item-level stagger for cards in a grid */
const cardContainerStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const cardItem = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Skills data (Aura Arsenal) ── */
const SKILLS = [
    { icon: SiReact, label: 'React', color: '#61DAFB' },
    { icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
    { icon: SiCplusplus, label: 'C++', color: '#00599C' },
    { icon: SiPython, label: 'Python', color: '#3776AB' },
    { icon: SiNodedotjs, label: 'Node.js', color: '#339933' },
    { icon: SiTailwindcss, label: 'Tailwind CSS', color: '#06B6D4' },
    { icon: SiUnrealengine, label: 'Unreal Engine', color: '#FFFFFF' },
    { icon: SiGnubash, label: 'Reverse Engineering', color: '#4EAA25' },
];

/* ── Games data ── */
const GAMES = [
    { logoUrl: '/assets/overwatch.png', name: 'Overwatch', stat: 'FPS Veteran' },
    { logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png', name: 'Fortnite', stat: 'Peak Top 1000 Global (Unreal)' },
    { logoUrl: '/assets/valorant.png', name: 'Valorant', stat: 'Competitive Player' },
    { logoUrl: '/assets/forza.ico', name: 'Forza Horizon 5', stat: 'Open world racer' },
];

/* ── PC Specs data ── */
const SPECS = [
    { icon: FaDesktop, label: 'Asrock B650M-HDV/M.2', detail: 'Motherboard' },
    { icon: FaMicrochip, label: 'Ryzen 5 7600X', detail: 'Processor' },
    { icon: FaHdd, label: 'RX 6800', detail: 'Graphics' },
    { icon: FaMemory, label: '16 GB DDR5 6000 MHz', detail: 'Memory' },
];

/**
 * HomeTab — Hero section with cascading scroll-triggered reveals.
 */
export default function HomeTab({ lanyard }) {
    return (
        <motion.div
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-12"
        >
            {/* ── Hero ── */}
            <motion.div variants={fadeBlur} className="text-center pt-4 sm:pt-8">
                <h1
                    className="text-5xl sm:text-7xl font-extrabold tracking-tight font-display silver-text-gradient mb-3 glitch-hover inline-block"
                >
                    Clem
                </h1>
                <p className="text-lg sm:text-xl text-txt-secondary font-medium">Developer &amp; Gamer</p>
            </motion.div>

            {/* ── Lanyard Discord card ── */}
            <motion.div variants={fadeBlur} className="max-w-md mx-auto relative z-20">
                <LanyardCard data={lanyard.data} loading={lanyard.loading} error={lanyard.error} />
            </motion.div>

            {/* ── The Aura Bio ── */}
            <motion.div variants={fadeBlur} className="max-w-2xl mx-auto mt-8">
                <div className="crystal-card p-6 relative overflow-hidden group magnetic-hover">
                    <div className="absolute top-2 right-3 text-[10px] font-mono text-txt-muted opacity-30 select-none">
                        AUTH_LVL_99 // SYS.OVERRIDE
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="mt-1">
                            <FaTerminal className="text-xl" style={{ color: 'var(--accent)' }} />
                        </div>
                        <div className="space-y-3">
                            <p className="text-txt-primary font-medium leading-relaxed font-mono text-sm sm:text-base">
                                <span className="text-white/50">{'> '}</span>Full-Stack Software Engineer &amp; Cyber-Security Enthusiast.
                            </p>
                            <p className="text-txt-secondary text-sm leading-relaxed">
                                Architecting high-performance systems and pixel-perfect user interfaces. Peak Top 1000 Global Competitor. Code is my weapon, design is my canvas.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Skills — individually staggered ── */}
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-4 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    Skills
                </h2>
                <motion.div
                    variants={cardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-3"
                >
                    {SKILLS.map((s) => (
                        <motion.div key={s.label} variants={cardItem}>
                            <SkillBadge {...s} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ── Gaming Stats — each card cascades in ── */}
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-4 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    Gaming Stats
                </h2>
                <motion.div
                    variants={cardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {GAMES.map((g) => (
                        <motion.div key={g.name} variants={cardItem}>
                            <GameCard {...g} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ── PC Specs — each card cascades in ── */}
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-4 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    Hardware
                </h2>
                <motion.div
                    variants={cardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {SPECS.map((spec) => (
                        <motion.div
                            key={spec.label}
                            variants={cardItem}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="crystal-card flex items-center gap-4 p-4"
                        >
                            <div className="relative z-10 flex items-center gap-4 w-full">
                                <spec.icon className="text-xl flex-shrink-0" style={{ color: 'var(--accent)' }} />
                                <div>
                                    <p className="text-txt-primary text-sm font-semibold">{spec.label}</p>
                                    <p className="text-txt-muted text-xs">{spec.detail}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div >
    );
}
