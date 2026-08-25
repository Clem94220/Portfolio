const TOTAL_VIEWS_KEY = 'stats:total_views';
const SEEN_PREFIX = 'seen:';
const ACTIVE_PREFIX = 'active:';
const RATE_PREFIX = 'rate:';
const VISITOR_COOKIE = 'clem_vid';
const CLIENT_HEADER_NAME = 'x-portfolio-client';
const CLIENT_HEADER_VALUE = 'clem-frontend-v1';
const DEFAULT_VIEW_SEED = 733;
const SEEN_TTL_SECONDS = 60 * 60 * 24; // 24h
const ACTIVE_TTL_SECONDS = 90;
const RATE_TTL_SECONDS = 5; // 5s — hardened from 2s
const MAX_ACTIVE_SCAN_PAGES = 5;
const MAX_REQUEST_BODY_BYTES = 512; // reject oversized POST bodies

function getAllowedOrigin(request) {
    const origin = request.headers.get('origin');
    if (!origin) return null;
    try {
        const requestUrl = new URL(request.url);
        if (origin === requestUrl.origin) return origin;
    } catch {
        // invalid URL
    }
    return null;
}

function baseSecurityHeaders(request) {
    const allowedOrigin = getAllowedOrigin(request);
    return {
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'referrer-policy': 'no-referrer',
        'permissions-policy': 'geolocation=(), camera=(), microphone=(), payment=()',
        'cross-origin-opener-policy': 'same-origin',
        'cross-origin-resource-policy': 'same-origin',
        'vary': 'Origin',
        ...(allowedOrigin
            ? { 'access-control-allow-origin': allowedOrigin }
            : {}),
    };
}

function jsonResponse(data, request, init = {}) {
    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
            ...baseSecurityHeaders(request),
            ...init.headers,
        },
        status: init.status || 200,
    });
}

function parseCookies(cookieHeader) {
    if (!cookieHeader) return {};

    return cookieHeader
        .split(';')
        .map((pair) => pair.trim())
        .filter(Boolean)
        .reduce((acc, pair) => {
            const index = pair.indexOf('=');
            if (index === -1) return acc;
            const key = pair.slice(0, index).trim();
            const value = pair.slice(index + 1).trim();
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
}

function serializeCookie(name, value, maxAgeSeconds = 60 * 60 * 24 * 365) {
    return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; Secure; HttpOnly`;
}

function randomId() {
    try {
        return crypto.randomUUID();
    } catch {
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }
}

function getClientIp(request) {
    const cfIp = request.headers.get('CF-Connecting-IP');
    if (cfIp) return cfIp;

    const forwarded = request.headers.get('X-Forwarded-For');
    if (forwarded) return forwarded.split(',')[0].trim();

    return 'unknown';
}

async function sha256Hex(input) {
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function getTotalViews(kv) {
    const raw = await kv.get(TOTAL_VIEWS_KEY);
    const value = Number(raw);
    if (!Number.isFinite(value) || value < DEFAULT_VIEW_SEED) return DEFAULT_VIEW_SEED;
    return value;
}

async function countActiveVisitors(kv) {
    let count = 0;
    let cursor = undefined;
    let page = 0;

    do {
        const result = await kv.list({
            prefix: ACTIVE_PREFIX,
            cursor,
            limit: 1000,
        });
        count += result.keys.length;
        cursor = result.list_complete ? undefined : result.cursor;
        page += 1;
    } while (cursor && page < MAX_ACTIVE_SCAN_PAGES);

    return count;
}

async function identifyVisitor(request) {
    const cookies = parseCookies(request.headers.get('Cookie'));
    let visitorId = cookies[VISITOR_COOKIE];
    let shouldSetCookie = false;

    if (!visitorId || visitorId.length < 8) {
        visitorId = randomId();
        shouldSetCookie = true;
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const fingerprint = await sha256Hex(`${ip}|${userAgent}|${visitorId}`);

    return { fingerprint, visitorId, shouldSetCookie };
}

function isSameOriginRequest(request) {
    const origin = request.headers.get('origin');
    if (!origin) return true;
    try {
        const requestUrl = new URL(request.url);
        return origin === requestUrl.origin;
    } catch {
        return false;
    }
}

function hasTrustedFetchSite(request) {
    const site = request.headers.get('sec-fetch-site');
    if (!site) return true;
    return site === 'same-origin' || site === 'same-site' || site === 'none';
}

function validateRequest(request) {
    if (request.method !== 'GET' && request.method !== 'POST' && request.method !== 'OPTIONS') {
        return jsonResponse({ error: 'method not allowed' }, request, { status: 405 });
    }

    const clientHeader = request.headers.get(CLIENT_HEADER_NAME);
    if (clientHeader !== CLIENT_HEADER_VALUE) {
        return jsonResponse({ error: 'forbidden' }, request, { status: 403 });
    }

    if (!isSameOriginRequest(request) || !hasTrustedFetchSite(request)) {
        return jsonResponse({ error: 'forbidden' }, request, { status: 403 });
    }

    return null;
}

async function checkRequestBodySize(request) {
    if (request.method !== 'POST') return true;

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_BYTES) {
        return false;
    }

    return true;
}

async function checkRateLimit(kv, fingerprint) {
    const key = `${RATE_PREFIX}${fingerprint}`;
    const seen = await kv.get(key);
    if (seen) return false;
    await kv.put(key, '1', { expirationTtl: RATE_TTL_SECONDS });
    return true;
}

async function createStatsResponse(kv, request, { incrementVisit }) {
    const { fingerprint, visitorId, shouldSetCookie } = await identifyVisitor(request);
    const seenKey = `${SEEN_PREFIX}${fingerprint}`;
    const activeKey = `${ACTIVE_PREFIX}${fingerprint}`;
    const allowWrite = await checkRateLimit(kv, fingerprint);
    const shouldIncrement = incrementVisit && allowWrite;

    let totalViews = await getTotalViews(kv);

    if (shouldIncrement) {
        const seen = await kv.get(seenKey);
        if (!seen) {
            totalViews += 1;
            await kv.put(TOTAL_VIEWS_KEY, String(totalViews));
            await kv.put(seenKey, '1', { expirationTtl: SEEN_TTL_SECONDS });
        } else {
            // Keep dedupe TTL fresh during active sessions.
            await kv.put(seenKey, '1', { expirationTtl: SEEN_TTL_SECONDS });
        }
    }

    if (allowWrite) {
        await kv.put(activeKey, String(Date.now()), { expirationTtl: ACTIVE_TTL_SECONDS });
    }
    const activeNow = Math.max(1, await countActiveVisitors(kv));

    const response = jsonResponse({
        totalViews,
        activeNow,
        source: 'cloudflare-kv',
    }, request);

    if (shouldSetCookie) {
        response.headers.append('set-cookie', serializeCookie(VISITOR_COOKIE, visitorId));
    }

    return response;
}

function getKvOrError(context) {
    const kv = context.env?.VIEWS_KV;
    if (!kv) {
        return jsonResponse(
            {
                error: 'VIEWS_KV binding missing',
                hint: 'Add a KV binding named VIEWS_KV in Cloudflare Pages settings.',
            },
            context.request,
            { status: 500 }
        );
    }
    return kv;
}

// ── OPTIONS preflight handler ──
export async function onRequestOptions(context) {
    const allowedOrigin = getAllowedOrigin(context.request);
    return new Response(null, {
        status: 204,
        headers: {
            'access-control-allow-methods': 'GET, POST, OPTIONS',
            'access-control-allow-headers': 'Content-Type, X-Portfolio-Client',
            'access-control-max-age': '86400',
            ...(allowedOrigin
                ? { 'access-control-allow-origin': allowedOrigin }
                : {}),
            'vary': 'Origin',
        },
    });
}

// ── POST handler ──
export async function onRequestPost(context) {
    const requestError = validateRequest(context.request);
    if (requestError) return requestError;

    const bodyOk = await checkRequestBodySize(context.request);
    if (!bodyOk) {
        return jsonResponse({ error: 'payload too large' }, context.request, { status: 413 });
    }

    const kvOrError = getKvOrError(context);
    if (kvOrError instanceof Response) return kvOrError;
    return createStatsResponse(kvOrError, context.request, { incrementVisit: true });
}

// ── GET handler ──
export async function onRequestGet(context) {
    const requestError = validateRequest(context.request);
    if (requestError) return requestError;

    const kvOrError = getKvOrError(context);
    if (kvOrError instanceof Response) return kvOrError;
    return createStatsResponse(kvOrError, context.request, { incrementVisit: false });
}

// ── Catch-all: reject HEAD, PUT, DELETE, PATCH ──
export async function onRequestHead(context) {
    return jsonResponse({ error: 'method not allowed' }, context.request, { status: 405 });
}
export async function onRequestPut(context) {
    return jsonResponse({ error: 'method not allowed' }, context.request, { status: 405 });
}
export async function onRequestDelete(context) {
    return jsonResponse({ error: 'method not allowed' }, context.request, { status: 405 });
}
export async function onRequestPatch(context) {
    return jsonResponse({ error: 'method not allowed' }, context.request, { status: 405 });
}
