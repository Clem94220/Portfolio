import { motion } from 'framer-motion';
import {
    FaDiscord, FaShoppingBag, FaCode, FaGlobe, FaTools,
    FaStar, FaShieldAlt
} from 'react-icons/fa';

const sectionStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const heroReveal = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(12px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const featureCardStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const featureCardItem = {
    hidden: { opacity: 0, y: 30, scale: 0.92, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const FEATURES = [
    { icon: FaCode, title: 'Custom Software', desc: 'From system-level C/C++ tools to full-stack web apps — built for performance and reliability.' },
    { icon: FaGlobe, title: 'Web Experiences', desc: 'Premium React frontends, landing pages, and dashboards engineered with care.' },
    { icon: FaTools, title: 'Private Tools', desc: 'Exclusive digital products available through our shop, crafted by our studio.' },
];

/**
 * CrystalSolutionSection — hero glass panel with cinematic reveal + cascading feature cards
 */
export default function CrystalSolutionSection() {
    return (
        <motion.div
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-10"
        >
            {/* ── Section heading ── */}
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 font-display tracking-wider uppercase text-sm"
                    style={{ color: 'var(--text-primary)' }}>
                    <span className="section-heading-bar" />
                    Crystal Solution
                </h2>
            </motion.div>

            {/* ── Hero glass panel — cinematic scale + blur reveal ── */}
            <motion.div variants={heroReveal} className="crystal-card p-8 sm:p-10 text-center"
                style={{ boxShadow: '0 0 60px rgba(255,255,255,0.04), 0 4px 30px rgba(0,0,0,0.5)' }}
            >
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl"
                            style={{ background: 'var(--accent-subtle)', boxShadow: '0 0 20px var(--accent-glow)' }}>
                            <img src="https://i.imgur.com/rPFPRiP.png" alt="Crystal Logo" className="w-10 h-10 object-contain" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3
                        className="text-4xl sm:text-5xl font-extrabold font-display silver-text-gradient mb-2 glitch-hover inline-block"
                    >
                        Crystal Solution
                    </h3>
                    <p className="text-sm font-mono tracking-[0.25em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
                        Community &amp; Studio
                    </p>

                    {/* Divider */}
                    <div className="mx-auto mb-6 w-24 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

                    {/* Description */}
                    <p className="text-txt-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                        We build high-performance tools, web experiences, and custom software.
                        Co-built with Aurélien.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        {['High Performance', 'Custom Software', 'Private Tools', 'Premium Quality'].map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{
                                    background: 'var(--accent-subtle)',
                                    color: 'var(--accent)',
                                    borderColor: 'var(--border-highlight)',
                                }}
                            >
                                <FaShieldAlt className="text-[10px]" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="https://crystal-solution.sellhub.cx/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl font-semibold font-display text-sm tracking-wider uppercase cursor-pointer border transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #a8a8a8 100%)',
                                color: '#030406',
                                borderColor: 'transparent',
                                boxShadow: '0 0 24px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.3)',
                            }}
                        >
                            <FaShoppingBag className="text-base" />
                            Open Shop
                        </motion.a>
                        <motion.a
                            href="https://discord.gg/evhpge7UCE"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl font-semibold font-display text-sm tracking-wider uppercase cursor-pointer border transition-all"
                            style={{
                                background: 'var(--bg-panel)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-highlight)',
                            }}
                        >
                            <FaDiscord className="text-base text-[#5865f2]" />
                            Join Discord
                        </motion.a>
                    </div>
                </div>
            </motion.div>

            {/* ── Feature cards — individually cascading ── */}
            <motion.div
                variants={featureCardStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
                {FEATURES.map((f) => (
                    <motion.div
                        key={f.title}
                        variants={featureCardItem}
                        whileHover={{ y: -5, scale: 1.03 }}
                        className="crystal-card p-6"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                                style={{ background: 'var(--accent-subtle)' }}>
                                <f.icon className="text-xl" style={{ color: 'var(--accent)' }} />
                            </div>
                            <h4 className="text-txt-primary font-bold font-display text-sm tracking-wider uppercase mb-2">{f.title}</h4>
                            <p className="text-txt-secondary text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
