import { useState, useEffect, useRef, useCallback } from 'react';

const DISCORD_USER_ID = '1145418060010901636';
const WS_URL = 'wss://api.lanyard.rest/socket';
const REST_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
const MAX_WS_RETRIES = 3;
const POLL_INTERVAL_MS = 12000;

function normalizeError(error, fallbackCode = 'request_failed') {
    if (error && typeof error === 'object') {
        return {
            code: error.code || fallbackCode,
            message: error.message || 'Erreur inconnue',
        };
    }

    return {
        code: fallbackCode,
        message: typeof error === 'string' ? error : 'Erreur inconnue',
    };
}

/**
 * useLanyard - Real-time Discord presence via Lanyard
 *
 * Strategy:
 * 1. Primary: WebSocket to wss://api.lanyard.rest/socket
 *    - Subscribes to presence updates for the target user
 *    - Sends heartbeats at server-specified interval
 *    - Auto-reconnects with exponential backoff on failure
 *
 * 2. Fallback: REST polling every 12s if WebSocket fails 3 times
 *    - Polls https://api.lanyard.rest/v1/users/{id}
 *    - Includes retry-safe interval management
 */
export function useLanyard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connectionType, setConnectionType] = useState('connecting');

    const wsRef = useRef(null);
    const heartbeatRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const pollingRef = useRef(null);
    const mountedRef = useRef(true);
    const manualCloseRef = useRef(false);
    const pollingInFlightRef = useRef(false);

    const stopHeartbeat = useCallback(() => {
        if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
            heartbeatRef.current = null;
        }
    }, []);

    const clearReconnectTimeout = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    /* -- REST fallback polling -- */
    const pollRest = useCallback(async () => {
        if (pollingInFlightRef.current) return;
        pollingInFlightRef.current = true;

        try {
            const res = await fetch(REST_URL);
            if (!res.ok) {
                let payload = null;

                try {
                    payload = await res.json();
                } catch {
                    payload = null;
                }

                const requestError = new Error(payload?.error?.message || `HTTP ${res.status}`);
                requestError.code = payload?.error?.code || `http_${res.status}`;
                throw requestError;
            }

            const json = await res.json();
            if (json.success && mountedRef.current) {
                setData(json.data);
                setLoading(false);
                setError(null);
                setConnectionType('polling');
            }
        } catch (err) {
            if (mountedRef.current) {
                setError(normalizeError(err));
                setLoading(false);
            }
        } finally {
            pollingInFlightRef.current = false;
        }
    }, []);

    const startPolling = useCallback(() => {
        if (pollingRef.current) return;
        setConnectionType('polling');
        pollRest();
        pollingRef.current = setInterval(pollRest, POLL_INTERVAL_MS);
    }, [pollRest]);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    const stopSocket = useCallback(() => {
        manualCloseRef.current = true;

        if (wsRef.current) {
            wsRef.current.onopen = null;
            wsRef.current.onmessage = null;
            wsRef.current.onerror = null;
            wsRef.current.onclose = null;
            if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
                wsRef.current.close();
            }
            wsRef.current = null;
        }

        stopHeartbeat();
    }, [stopHeartbeat]);

    /* -- WebSocket connection -- */
    const connectWs = useCallback(() => {
        if (!mountedRef.current) return;

        clearReconnectTimeout();
        stopSocket();
        manualCloseRef.current = false;

        try {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                reconnectAttemptsRef.current = 0;
                setConnectionType('websocket');
            };

            ws.onmessage = (event) => {
                if (!mountedRef.current) return;

                let msg;
                try {
                    msg = JSON.parse(event.data);
                } catch {
                    return;
                }

                switch (msg.op) {
                    /* op 1 = Hello - start heartbeat and subscribe */
                    case 1: {
                        const interval = Number(msg?.d?.heartbeat_interval) || 30000;
                        stopHeartbeat();

                        heartbeatRef.current = setInterval(() => {
                            if (ws.readyState === WebSocket.OPEN) {
                                ws.send(JSON.stringify({ op: 3 }));
                            }
                        }, interval);

                        ws.send(
                            JSON.stringify({
                                op: 2,
                                d: { subscribe_to_id: DISCORD_USER_ID },
                            })
                        );
                        break;
                    }

                    /* op 0 = Event dispatch (INIT_STATE / PRESENCE_UPDATE) */
                    case 0: {
                        if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
                            setData(msg.d);
                            setLoading(false);
                            setError(null);
                            setConnectionType('websocket');
                            stopPolling();
                        }
                        break;
                    }
                }
            };

            ws.onerror = () => {
                /* handled in onclose */
            };

            ws.onclose = () => {
                stopHeartbeat();
                if (!mountedRef.current) return;
                if (manualCloseRef.current) return;

                if (reconnectAttemptsRef.current >= MAX_WS_RETRIES) {
                    startPolling();
                    return;
                }

                reconnectAttemptsRef.current += 1;
                const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
                clearReconnectTimeout();
                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWs();
                }, delay);
            };
        } catch {
            if (mountedRef.current) {
                startPolling();
            }
        }
    }, [clearReconnectTimeout, startPolling, stopHeartbeat, stopPolling, stopSocket]);

    useEffect(() => {
        mountedRef.current = true;
        connectWs();

        return () => {
            mountedRef.current = false;
            clearReconnectTimeout();
            stopSocket();
            stopPolling();
        };
    }, [clearReconnectTimeout, connectWs, stopPolling, stopSocket]);

    return { data, loading, error, connectionType };
}
