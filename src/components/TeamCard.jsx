import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanyard } from '../hooks/useLanyard';
import { useTranslation } from '../contexts/LanguageContext';

const STATUS_CONFIG = {
    online: { color: '#23a55a', glow: 'rgba(35, 165, 90, 0.4)', labelFr: 'En ligne', labelEn: 'Online' },
    idle: { color: '#f0b232', glow: 'rgba(240, 178, 50, 0.4)', labelFr: 'Inactif', labelEn: 'Idle' },
    dnd: { color: '#f23f43', glow: 'rgba(242, 63, 67, 0.4)', labelFr: 'Ne pas déranger', labelEn: 'Do not disturb' },
    offline: { color: '#80848e', glow: 'rgba(128, 132, 142, 0.4)', labelFr: 'Hors ligne', labelEn: 'Offline' },
};

function formatAvatarUrl(url) {
    if (!url) return 'https://cdn.discordapp.com/embed/avatars/0.png';
    // Fix imgur webpage URL to direct image URL
    if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
        const id = url.split('/').pop().replace(/\.[^/.]+$/, '');
        return `https://i.imgur.com/${id}.png`;
    }
    return url;
}

/**
 * TeamCard — Crystal theme team member card with parallax tilt + dynamic Lanyard Discord integration
 */
export default function TeamCard({ member, index = 0 }) {
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const tiltDataRef = useRef({ x: 0, y: 0 });
    const [imgSrc, setImgSrc] = useState(() => formatAvatarUrl(member.avatar));
    const { language } = useTranslation();

    // Dynamically query Lanyard Discord API if member has a discordId
    const lanyard = useLanyard(member.discordId || null);

    const handleMouseMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        tiltDataRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        tiltDataRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                const card = cardRef.current;
                if (card) {
                    const { x, y } = tiltDataRef.current;
                    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
                    card.style.zIndex = '20';
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
        const card = cardRef.current;
        if (card) {
            card.style.transition = 'transform 0.4s ease-out';
            card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
            card.style.zIndex = '';
            setTimeout(() => {
                if (card) card.style.transition = '';
            }, 400);
        }
    }, []);

    // Extract dynamic Discord avatar and status if Lanyard data is active
    let displayAvatar = imgSrc;
    let discordStatus = null;
    let customStatus = null;

    if (member.discordId && lanyard.data?.discord_user) {
        const user = lanyard.data.discord_user;
        if (user.avatar) {
            displayAvatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
                user.avatar.startsWith('a_') ? 'gif' : 'png'
            }?size=256`;
        }
        const statusKey = lanyard.data.discord_status || 'offline';
        discordStatus = STATUS_CONFIG[statusKey] || STATUS_CONFIG.offline;

        const custom = lanyard.data.activities?.find((a) => a.type === 4);
        if (custom?.state) {
            customStatus = `${custom.emoji?.name ? custom.emoji.name + ' ' : ''}${custom.state}`;
        }
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="crystal-card p-6 group relative overflow-hidden flex flex-col justify-between"
        >
            <div className="relative z-10">
                {/* Avatar + Name + Discord Live Status */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                        <img
                            src={displayAvatar}
                            alt={member.name}
                            onError={() => {
                                // Graceful fallback if image fails
                                if (imgSrc.includes('imgur.com')) {
                                    setImgSrc('https://i.imgur.com/pns1uJE.png');
                                } else {
                                    setImgSrc('https://cdn.discordapp.com/embed/avatars/0.png');
                                }
                            }}
                            className="w-16 h-16 rounded-full ring-2 ring-white/15 group-hover:ring-accent/50 transition-all object-cover"
                            loading="lazy"
                            decoding="async"
                            style={
                                discordStatus
                                    ? { boxShadow: `0 0 14px ${discordStatus.glow}` }
                                    : undefined
                            }
                        />
                        {discordStatus && (
                            <span
                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[var(--bg-dark)]"
                                style={{
                                    backgroundColor: discordStatus.color,
                                    boxShadow: `0 0 8px ${discordStatus.glow}`,
                                }}
                                title={language === 'en' ? discordStatus.labelEn : discordStatus.labelFr}
                            />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-txt-primary font-bold text-lg truncate">{member.name}</h3>
                            {discordStatus && (
                                <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border"
                                    style={{
                                        color: discordStatus.color,
                                        borderColor: `${discordStatus.color}40`,
                                        background: `${discordStatus.color}15`,
                                    }}
                                >
                                    {language === 'en' ? discordStatus.labelEn : discordStatus.labelFr}
                                </span>
                            )}
                        </div>
                        <p className="text-txt-muted text-sm font-mono truncate">@{member.handle}</p>
                        {customStatus && (
                            <p className="text-txt-secondary text-xs truncate mt-0.5 italic">
                                {customStatus}
                            </p>
                        )}
                    </div>
                </div>

                {/* Role */}
                <p className="text-txt-secondary text-sm mb-2 leading-relaxed">{member.role}</p>

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
                                {badge.icon && (
                                    <img
                                        src={badge.icon}
                                        alt=""
                                        className="w-4 h-4 rounded-full"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                )}
                                {badge.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
