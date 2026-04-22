import { motion } from 'framer-motion';
import { STAFF_SERVERS, TEAM_FRIENDS } from '../data/portfolioData';
import SectionHeading from './SectionHeading';
import SafeImage from './SafeImage';
import TeamCard from './TeamCard';

const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
    hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function CommunitySection() {
    return (
        <div className="space-y-8">
            <SectionHeading
                title="Communaute"
                description="Les serveurs ou je suis actif et les personnes avec qui je bosse."
            />

            <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-[0.2em] font-display text-txt-secondary">Serveurs staff</h3>
                <motion.div
                    variants={list}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                    {STAFF_SERVERS.map((server) => (
                        <motion.article
                            key={server.name}
                            variants={item}
                            className="crystal-card p-4 flex flex-col items-center justify-center text-center gap-2"
                        >
                            <SafeImage
                                src={server.icon}
                                alt={server.name}
                                className="w-12 h-12 rounded-xl object-cover"
                                fallbackClassName="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center"
                                fallbackLabel={server.name}
                                loading="lazy"
                            />
                            <span className="text-sm font-semibold text-txt-primary">{server.name}</span>
                        </motion.article>
                    ))}
                </motion.div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-[0.2em] font-display text-txt-secondary">Equipe / Amis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {TEAM_FRIENDS.map((member, index) => (
                        <TeamCard key={member.handle} member={member} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
