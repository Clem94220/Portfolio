import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useViewCounter
 * - Primary mode: Cloudflare endpoint (/api/views)
 * - Fallback mode: localStorage-only counter (dev/offline)
 */

const STORAGE_PREFIX = 'clem_neon_portfolio_v2';
const REMOTE_STATS_ENDPOINT = '/api/views';
const REMOTE_CLIENT_HEADER = 'clem-frontend-v1';
const HEARTBEAT_INTERVAL_MS = 15000; // 15 seconds
const ACTIVE_WINDOW_MS = 60000;
const VIEW_SEED = 733;
const BUCKET_INDEX_KEY = `${STORAGE_PREFIX}_active_index`;

function getStorage() {
    try {
        if (typeof window === 'undefined') return null;
        return window.localStorage;
    } catch {
        return null;
    }
}

function safeGet(storage, key) {
    try {
        return storage?.getItem(key) ?? null;
    } catch {
        return null;
    }
}

function safeSet(storage, key, value) {
    try {
        storage?.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

function safeRemove(storage, key) {
    try {
        storage?.removeItem(key);
    } catch {
        /* no-op */
    }
}

function parseJson(value, fallback) {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function generateId() {
    try {
        return crypto.randomUUID();
    } catch {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

function getBucketNumber(timestamp) {
    return Math.floor(timestamp / HEARTBEAT_INTERVAL_MS);
}

function getBucketKey(bucketNumber) {
    return `${STORAGE_PREFIX}_active_${bucketNumber}`;
}

export function useViewCounter() {
    const [totalViews, setTotalViews] = useState(VIEW_SEED);
    const [activeNow, setActiveNow] = useState(1);
    const intervalRef = useRef(null);
    const fallbackVisitorIdRef = useRef(generateId());

    const applyRemotePayload = useCallback((payload) => {
        if (!payload || typeof payload !== 'object') return false;

        const remoteTotal = Number(payload.totalViews);
        const remoteActive = Number(payload.activeNow);

        let hasValue = false;

        if (Number.isFinite(remoteTotal)) {
            setTotalViews(remoteTotal);
            hasValue = true;
        }

        if (Number.isFinite(remoteActive)) {
            setActiveNow(Math.max(1, remoteActive));
            hasValue = true;
        }

        return hasValue;
    }, []);

    const fetchRemoteStats = useCallback(async (method = 'GET') => {
        try {
            const res = await fetch(REMOTE_STATS_ENDPOINT, {
                method,
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Portfolio-Client': REMOTE_CLIENT_HEADER,
                },
                keepalive: method === 'POST',
                cache: 'no-store',
            });

            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }, []);

    const getVisitorId = useCallback(() => {
        const storage = getStorage();
        if (!storage) return fallbackVisitorIdRef.current;

        const key = `${STORAGE_PREFIX}_visitor_id`;
        let id = safeGet(storage, key);
        if (!id) {
            id = generateId();
            safeSet(storage, key, id);
        }
        return id;
    }, []);

    const startLocalMode = useCallback(() => {
        const storage = getStorage();
        if (!storage) {
            setTotalViews(VIEW_SEED + 1);
            setActiveNow(1);
            return () => {};
        }

        const viewedKey = `${STORAGE_PREFIX}_viewed`;
        const countKey = `${STORAGE_PREFIX}_total_views`;
        let count = parseInt(safeGet(storage, countKey) || '0', 10);
        if (!Number.isFinite(count) || count < VIEW_SEED) count = VIEW_SEED;

        if (!safeGet(storage, viewedKey)) {
            count += 1;
            safeSet(storage, viewedKey, 'true');
            safeSet(storage, countKey, count.toString());
        }
        setTotalViews(count);

        const visitorId = getVisitorId();
        const bucketsToCheck = Math.ceil(ACTIVE_WINDOW_MS / HEARTBEAT_INTERVAL_MS);
        const retentionBuckets = Math.ceil(120000 / HEARTBEAT_INTERVAL_MS); // 2 minutes

        const sendLocalHeartbeat = () => {
            const now = Date.now();
            const currentBucket = getBucketNumber(now);
            const currentKey = getBucketKey(currentBucket);

            const bucketData = parseJson(safeGet(storage, currentKey), {});
            bucketData[visitorId] = now;
            safeSet(storage, currentKey, JSON.stringify(bucketData));

            const bucketIndex = parseJson(safeGet(storage, BUCKET_INDEX_KEY), []);
            const normalizedIndex = Array.isArray(bucketIndex)
                ? bucketIndex.filter((value) => Number.isInteger(value))
                : [];

            if (!normalizedIndex.includes(currentBucket)) {
                normalizedIndex.push(currentBucket);
            }

            const uniqueVisitors = new Set();
            for (let i = 0; i < bucketsToCheck; i++) {
                const bucketNum = currentBucket - i;
                const data = parseJson(safeGet(storage, getBucketKey(bucketNum)), {});
                Object.keys(data).forEach((id) => uniqueVisitors.add(id));
            }
            setActiveNow(Math.max(1, uniqueVisitors.size));

            const minBucket = currentBucket - retentionBuckets;
            const keptBuckets = normalizedIndex.filter((bucketNum) => bucketNum >= minBucket);
            normalizedIndex.forEach((bucketNum) => {
                if (bucketNum < minBucket) safeRemove(storage, getBucketKey(bucketNum));
            });
            safeSet(storage, BUCKET_INDEX_KEY, JSON.stringify(keptBuckets));
        };

        sendLocalHeartbeat();
        intervalRef.current = setInterval(sendLocalHeartbeat, HEARTBEAT_INTERVAL_MS);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [getVisitorId]);

    useEffect(() => {
        let cleanup = () => {};
        let cancelled = false;

        const start = async () => {
            // 1) Try global Cloudflare counter first
            const firstPayload = await fetchRemoteStats('POST');
            if (!cancelled && firstPayload && applyRemotePayload(firstPayload)) {
                intervalRef.current = setInterval(async () => {
                    const payload = await fetchRemoteStats('GET');
                    if (!payload || cancelled) return;
                    applyRemotePayload(payload);
                }, HEARTBEAT_INTERVAL_MS);

                cleanup = () => {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                };
                return;
            }

            // 2) Fallback to local mode (dev or no Cloudflare Functions)
            if (!cancelled) {
                cleanup = startLocalMode();
            }
        };

        start();

        return () => {
            cancelled = true;
            cleanup();
        };
    }, [applyRemotePayload, fetchRemoteStats, startLocalMode]);

    return { totalViews, activeNow };
}
