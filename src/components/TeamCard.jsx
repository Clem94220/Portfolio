import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TeamCard — Crystal theme team member card with parallax tilt + skill pills.
 */
export default function TeamCard({ member, index = 0 }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        setTilt({ x, y });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -6 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
                transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: 'transform 0.15s ease-out',
            }}
            className="crystal-card p-6 group"
        >
            <div className="relative z-10">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-full ring-2 ring-accent/30 group-hover:ring-accent/60 transition-all object-cover flex-shrink-0"
                        loading="lazy"
                        decoding="async"
                    />
                    <div>
                        <h3 className="text-txt-primary font-bold text-lg">{member.name}</h3>
                        <p className="text-txt-muted text-sm font-mono">@{member.handle}</p>
                    </div>
                </div>

                {/* Role */}
                <p className="text-txt-secondary text-sm mb-2">{member.role}</p>

                {/* Stats */}
                {member.stats && <p className="text-txt-muted text-xs mb-3">{member.stats}</p>}

                {/* Skill pills */}
                {member.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                        {member.skills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-mono border"
                                style={{
                                    background: 'var(--accent-subtle)',
                                    color: 'var(--accent)',
                                    borderColor: 'var(--border-crystal)',
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* Badges */}
                {member.badges?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {member.badges.map((badge, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{
                                    background: 'var(--accent-subtle)',
                                    color: 'var(--accent)',
                                    borderColor: 'var(--border-highlight)',
                                    boxShadow: '0 0 8px var(--border-glow)',
                                }}
                            >
                                {badge.icon && <img src={badge.icon} alt="" className="w-4 h-4 rounded-full" loading="lazy" decoding="async" />}
                                {badge.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
