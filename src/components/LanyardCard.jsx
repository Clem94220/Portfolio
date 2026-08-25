import { useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';

function formatElapsed(startMs, t) {
    if (!startMs) return null;
    const minutes = Math.floor((Date.now() - startMs) / 60000);
    if (minutes < 1) return t.common.justNow;
    const hours = Math.floor(minutes / 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
    return `${timeStr} ${t.common.elapsed}`;
}

function getActivityImageUrl(activity, spotify) {
    if (!activity) return null;

    if (spotify?.album_art_url) {
        return spotify.album_art_url;
    }

    const largeImage = activity.assets?.large_image;
    if (!largeImage) return null;

    if (largeImage.startsWith('mp:')) {
        return `https://media.discordapp.net/${largeImage.slice(3)}`;
    }

    if (largeImage.startsWith('spotify:')) {
        return `https://i.scdn.co/image/${largeImage.slice('spotify:'.length)}`;
    }

    if (!activity.application_id) return null;
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${largeImage}.png`;
}

function Skeleton() {
    return (
        <div className="animate-pulse flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-full bg-white/6 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/6 rounded w-3/5" />
                <div className="h-3 bg-white/6 rounded w-2/5" />
                <div className="h-3 bg-white/6 rounded w-1/2" />
            </div>
        </div>
    );
}

function SpotifyVisualizer() {
    return (
        <div className="flex items-end gap-[3px] h-[13px] w-[14px] flex-shrink-0">
            <div className="w-[2.5px] h-full bg-[var(--accent)] rounded-full animate-[spotify-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
            <div className="w-[2.5px] h-full bg-[var(--accent)] rounded-full animate-[spotify-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.15s' }} />
            <div className="w-[2.5px] h-full bg-[var(--accent)] rounded-full animate-[spotify-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
            <div className="w-[2.5px] h-full bg-[var(--accent)] rounded-full animate-[spotify-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.45s' }} />
        </div>
    );
}

export default function LanyardCard({ data, loading, error }) {
    const { t } = useTranslation();

    // ── Zero-React-rerender tilt using direct DOM mutation via ref
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const tiltDataRef = useRef({ rX: 0, rY: 0, active: false });

    const handleMouseMove = useCallback((event) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - rect.width / 2;
        const mouseY = event.clientY - rect.top - rect.height / 2;

        tiltDataRef.current.rX = -(mouseY / (rect.height / 2)) * 6;
        tiltDataRef.current.rY = (mouseX / (rect.width / 2)) * 6;
        tiltDataRef.current.active = true;

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                const el = cardRef.current;
                if (el && tiltDataRef.current.active) {
                    const { rX, rY } = tiltDataRef.current;
                    el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
                    el.style.zIndex = '30';
                }
                rafRef.current = null;
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        tiltDataRef.current.active = false;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        const el = cardRef.current;
        if (el) {
            el.style.transition = 'transform 0.4s ease-out';
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            el.style.zIndex = '';
            // Remove transition after animation to allow fast re-entry
            setTimeout(() => {
                if (el) el.style.transition = '';
            }, 400);
        }
    }, []);

    if (loading) {
        return (
            <div className="crystal-card overflow-hidden">
                <Skeleton />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="crystal-card overflow-hidden p-4 text-center border border-[var(--red)]/40">
                <p className="text-sm font-mono text-[var(--red)]">{t.common.unavailable}</p>
                <p className="text-xs text-txt-muted mt-1">{t.common.reconnecting}</p>
            </div>
        );
    }

    const STATUS_MAP = {
        online: {
            color: '#23a55a',
            glow: 'rgba(35, 165, 90, 0.4)',
            label: t.common.online,
        },
        idle: {
            color: '#f0b232',
            glow: 'rgba(240, 178, 50, 0.4)',
            label: t.common.idle,
        },
        dnd: {
            color: '#f23f43',
            glow: 'rgba(242, 63, 67, 0.4)',
            label: t.common.dnd,
        },
        offline: {
            color: '#80848e',
            glow: 'rgba(128, 132, 142, 0.4)',
            label: t.common.offline,
        },
    };

    const ACTIVITY_LABELS = {
        0: t.common.playing,
        1: t.common.streaming,
        2: t.common.listeningTo,
        3: t.common.watching,
        4: t.common.justNow,
        5: t.common.competingIn,
    };

    const { discord_user, discord_status, activities, spotify } = data;
    const status = STATUS_MAP[discord_status] || STATUS_MAP.offline;
    const activity = activities?.find(
        (entry) =>
            entry.type !== 4 &&
            (entry.name || entry.details || entry.state || entry.assets?.large_image)
    );
    const customStatus = activities?.find((entry) => entry.type === 4);
    const hasActivity = Boolean(
        activity && (activity.name || activity.details || activity.state || activity.assets?.large_image)
    );
    const activityImageUrl = getActivityImageUrl(activity, spotify);

    const avatarUrl = discord_user.avatar
        ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${(BigInt(discord_user.id) >> 22n) % 6n}.png`;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="crystal-card overflow-hidden"
        >
            <div className="p-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <img
                            src={avatarUrl}
                            alt={discord_user.username}
                            className="w-16 h-16 rounded-full"
                            loading="lazy"
                            decoding="async"
                            style={{ boxShadow: `0 0 14px ${status.glow}` }}
                        />
                        <span
                            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
                            style={{
                                backgroundColor: status.color,
                                boxShadow: `0 0 8px ${status.glow}`,
                                borderColor: 'var(--bg-dark)',
                            }}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-txt-primary font-semibold text-lg truncate">
                            {discord_user.display_name || discord_user.global_name || discord_user.username}
                        </h3>
                        <p className="text-txt-muted text-sm font-mono truncate">@{discord_user.username}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                            <span className="text-xs text-txt-secondary">{status.label}</span>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {customStatus?.state && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 text-sm text-txt-secondary"
                        >
                            {customStatus.emoji?.name && <span className="mr-1">{customStatus.emoji.name}</span>}
                            {customStatus.state}
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {hasActivity && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mt-3 p-3 rounded-lg border border-white/12"
                            style={{ background: 'var(--bg-panel)' }}
                        >
                            <div className="flex items-start gap-3">
                                {activityImageUrl && (
                                    <img
                                        src={activityImageUrl}
                                        alt={activity.assets?.large_text || activity.name}
                                        className="w-11 h-11 rounded-md flex-shrink-0"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-mono uppercase tracking-wider text-txt-muted mb-0.5">
                                        {ACTIVITY_LABELS[activity.type] || t.common.activity}
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-txt-primary text-sm font-semibold truncate">
                                            {activity.name || t.common.discordActivity}
                                        </p>
                                        {activity.name === 'Spotify' && <SpotifyVisualizer />}
                                    </div>
                                    {activity.details && <p className="text-txt-secondary text-xs truncate">{activity.details}</p>}
                                    {activity.state && <p className="text-txt-muted text-xs truncate">{activity.state}</p>}
                                    {activity.timestamps?.start && (
                                        <p className="text-txt-muted text-xs font-mono mt-1">
                                            {formatElapsed(activity.timestamps.start, t)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
