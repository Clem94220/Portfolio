import { useEffect, useState } from 'react';

/**
 * Reads member / online counts from the public Discord invite endpoint.
 * Returns null counts on any failure so the UI can simply hide them.
 */
export function useDiscordInvite(code) {
    const [counts, setCounts] = useState({ members: null, online: null });

    useEffect(() => {
        const controller = new AbortController();

        fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`, { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('invite'))))
            .then((data) => {
                setCounts({
                    members: data.approximate_member_count ?? null,
                    online: data.approximate_presence_count ?? null,
                });
            })
            .catch(() => { });

        return () => controller.abort();
    }, [code]);

    return counts;
}
