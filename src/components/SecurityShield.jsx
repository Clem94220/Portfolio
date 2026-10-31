import { useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

/**
 * SecurityShield — invisible component that adds client-side protections.
 *
 * 1. Anti-iframe (frame-busting backup)
 * 2. Console warning message
 * 3. Image drag disabled
 */
export default function SecurityShield() {
    const { t } = useTranslation();

    useEffect(() => {
        // ── 1. Frame-busting ──
        if (window.self !== window.top) {
            try {
                window.top.location.href = window.self.location.href;
            } catch {
                document.body.innerHTML = '';
                document.body.style.display = 'none';
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
            `%c${t.security.warning}`,
            subStyle
        );

        // ── 3. Block drag on images ──
        const handleDragStart = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    // Render nothing — this is a pure side-effect component
    return null;
}
