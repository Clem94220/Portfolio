import { AnimatePresence, motion } from 'framer-motion';

const STATUS_MAP = {
    online: { color: '#00d18f', glow: 'rgba(0,209,143,0.35)', label: 'Online' },
    idle: { color: '#f0b429', glow: 'rgba(240,180,41,0.3)', label: 'Idle' },
    dnd: { color: '#e0536b', glow: 'rgba(224,83,107,0.35)', label: 'Do not disturb' },
    offline: { color: '#606775', glow: 'rgba(96,103,117,0.28)', label: 'Offline' },
};

const ACTIVITY_LABELS = {
    0: 'Playing',
    1: 'Streaming',
    2: 'Listening to',
    3: 'Watching',
    5: 'Competing in',
};

function formatElapsed(startMs) {
    if (!startMs) return null;
    const minutes = Math.floor((Date.now() - startMs) / 60000);
    if (minutes < 1) return 'just now';
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
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

export default function LanyardCard({ data, loading, error }) {
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
                <p className="text-sm font-mono text-[var(--red)]">Presence indisponible</p>
                <p className="text-xs text-txt-muted mt-1">Reconnexion automatique...</p>
            </div>
        );
    }

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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
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
                                        alt={activity.assets.large_text || activity.name}
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
                                        {ACTIVITY_LABELS[activity.type] || 'Activity'}
                                    </p>
                                    <p className="text-txt-primary text-sm font-semibold truncate">
                                        {activity.name || 'Activite Discord'}
                                    </p>
                                    {activity.details && <p className="text-txt-secondary text-xs truncate">{activity.details}</p>}
                                    {activity.state && <p className="text-txt-muted text-xs truncate">{activity.state}</p>}
                                    {activity.timestamps?.start && (
                                        <p className="text-txt-muted text-xs font-mono mt-1">
                                            {formatElapsed(activity.timestamps.start)} elapsed
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
