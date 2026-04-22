export const AUDIO_REACTIVE_EVENT = 'portfolio:audio-reactive';

export function emitAudioReactiveState(detail) {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
        new CustomEvent(AUDIO_REACTIVE_EVENT, {
            detail: {
                playing: Boolean(detail?.playing),
                intensity: Math.max(0, Math.min(1, Number(detail?.intensity) || 0)),
                bass: Math.max(0, Math.min(1, Number(detail?.bass) || 0)),
                volume: Math.max(0, Math.min(1, Number(detail?.volume) || 0)),
            },
        })
    );
}
