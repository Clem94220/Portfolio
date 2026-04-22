import { useEffect } from 'react';

/**
 * SecurityShield — invisible component that adds client-side protections.
 *
 * 1. Anti-iframe (frame-busting backup)
 * 2. Console warning message
 */
export default function SecurityShield() {
    useEffect(() => {
        // ── 1. Frame-busting ──
        if (window.self !== window.top) {
            try {
                window.top.location.href = window.self.location.href;
            } catch {
                // Headers already block framing in production; this stays as a soft fallback.
            }
        }

        // ── 2. Console warning ──
        const warningStyle = [
            'color: #e0536b',
            'font-size: 32px',
            'font-weight: bold',
            'text-shadow: 1px 1px 2px rgba(0,0,0,0.4)',
        ].join(';');

        const subStyle = [
            'color: #9ca3af',
            'font-size: 14px',
        ].join(';');

        console.log('%c⚠ STOP', warningStyle);
        console.log(
            '%cCette console est destinée aux développeurs. Si quelqu\'un vous a demandé de coller quelque chose ici, c\'est une arnaque. Fermez cette fenêtre.',
            subStyle
        );
        console.log(
            '%cSi tu es développeur, respect. Mais sache que tout est monitoré. 🛡️',
            subStyle
        );

        return () => {
            // no-op
        };
    }, []);

    return null;
}
