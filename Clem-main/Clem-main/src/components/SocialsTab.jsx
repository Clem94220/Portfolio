import { motion } from 'framer-motion';
import { SiInstagram, SiSteam, SiDiscord } from 'react-icons/si';
import { FaExternalLinkAlt } from 'react-icons/fa';

const sectionStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const cardContainerStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const cardItem = {
    hidden: { opacity: 0, x: -20, filter: 'blur(6px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const cardItemScale = {
    hidden: { opacity: 0, y: 20, scale: 0.92, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Social links ── */
const LINKS = [
    { icon: SiInstagram, label: 'Instagram', handle: '@clem94_220', url: 'https://www.instagram.com/clem94_220', color: '#e0e0e0' },
    { icon: SiSteam, label: 'Steam', handle: 'TopGs', url: 'https://steamcommunity.com/id/947616406464/', color: '#ffffff' },
    { icon: SiDiscord, label: 'Discord Server', handle: 'Join us', url: 'https://discord.gg/evhpge7UCE', color: '#c2c2c2' },
];

/* ── Staff roles ── */
const STAFF_ROLES = [
    { name: 'Eon', icon: 'https://cdn.discordapp.com/icons/1295075156498317434/22c40ecaef78fdb06c5eaef833dfc104.png' },
    { name: 'Jinx', icon: 'https://cdn.discordapp.com/icons/1124276483846836224/993c299f53496859540974235a39e30b.png' },
    { name: 'Fairgame', icon: 'https://cdn.discordapp.com/icons/1475953315329081455/eb832513d611fa61c20a3a012f5f90f0.png' },
];

/**
 * SocialsTab — Social links + Staff role badges with cascading reveals
 */
export default function SocialsTab() {
    return (
        <motion.div
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-12"
        >
            {/* ── My Links — each link slides in from left ── */}
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-5 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    My Links
                </h2>
                <motion.div
                    variants={cardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="space-y-3"
                >
                    {LINKS.map((link) => (
                        <motion.a
                            key={link.label}
                            variants={cardItem}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ x: 6, scale: 1.01 }}
                            className="crystal-card flex items-center gap-4 p-4 group magnetic-hover"
                        >
                            <div className="relative z-10 flex items-center gap-4 w-full">
                                <link.icon className="text-2xl flex-shrink-0 transition-all group-hover:drop-shadow-[0_0_8px_var(--accent-glow)]" style={{ color: link.color }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-txt-primary font-semibold text-sm">{link.label}</p>
                                    <p className="text-txt-muted text-xs font-mono truncate">{link.handle}</p>
                                </div>
                                <FaExternalLinkAlt className="text-txt-muted text-sm group-hover:text-accent transition-colors relative z-10" />
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </motion.div>

            {/* ── Staff Roles — each card scales in ── */}
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-5 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    Staff Roles
                </h2>
                <motion.div
                    variants={cardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {STAFF_ROLES.map((role) => (
                        <motion.div
                            key={role.name}
                            variants={cardItemScale}
                            whileHover={{ y: -4, scale: 1.03 }}
                            className="crystal-card flex items-center gap-3 p-4 magnetic-hover"
                        >
                            <div className="relative z-10 flex items-center gap-3 w-full">
                                <img src={role.icon} alt={role.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                <div>
                                    <p className="text-txt-primary font-semibold text-sm">{role.name}</p>
                                    <p className="text-accent text-xs font-mono">Staff</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
