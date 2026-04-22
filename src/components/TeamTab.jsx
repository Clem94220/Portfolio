import { motion } from 'framer-motion';
import TeamCard from './TeamCard';

const sectionStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const teamCardContainerStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};
const teamCardItem = {
    hidden: { opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' },
    show: {
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
};

const TEAM = [
    {
        name: 'Aurélien',
        handle: 'aurelien6707',
        avatar: 'https://cdn.discordapp.com/avatars/968376926064492595/fd570eac4d6651992026c83bdd8706b9.png?size=4096',
        role: 'Software Developer — Specialized in C, C++, C#',
        badges: [{ label: 'Co-Founder • Crystal Solution' }],
        skills: ['C', 'C++', 'C#', 'Systems', 'Optimization'],
    },
    {
        name: 'Vardox',
        handle: 'vardox58',
        avatar: 'https://cdn.discordapp.com/avatars/1373318082461962333/9de58badd7be6af309bb8f85c4f029e6.png?size=4096',
        role: 'Full-Stack Web Developer & C/C++ Developer — React, Node.js, Tailwind, HTML/CSS',
        stats: 'Valorant Diamond · Fortnite Player',
        badges: [{ label: 'Staff at Arp', icon: 'https://cdn.discordapp.com/icons/1471986667509387391/185dc8cf6c9fa8a33de8f9ff93777410.png' }],
        skills: ['React', 'Node.js', 'Tailwind', 'HTML/CSS', 'C', 'C++'],
    },
    {
        name: 'Wayp',
        handle: 'waypx3',
        avatar: 'https://cdn.discordapp.com/avatars/1323387708973908140/7394c1bcc644d89a61bdcb8cdb1ca2ea.png?size=4096',
        role: 'Competitive Gamer & CRT Trader',
        stats: 'Fortnite Unreal Top 1000 · Sea of Thieves High Rank · CRT Trader',
        badges: [],
        skills: ['Fortnite', 'Sea of Thieves', 'CRT Trading', 'Strategy', 'Analytics'],
    },
];

/**
 * TeamTab — 3 premium team member cards with deep cascade reveal (blur + scale)
 */
export default function TeamTab() {
    return (
        <motion.div
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-8"
        >
            <motion.div variants={fadeBlur}>
                <h2 className="text-xl font-semibold text-txt-primary mb-5 flex items-center gap-2 font-display tracking-wider uppercase text-sm">
                    <span className="section-heading-bar" />
                    The Team
                </h2>
                <motion.div
                    variants={teamCardContainerStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {TEAM.map((member, i) => (
                        <motion.div key={member.handle} variants={teamCardItem}>
                            <TeamCard member={member} index={i} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
