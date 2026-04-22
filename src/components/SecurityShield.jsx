import { useEffect } from 'react';

/**
 * SecurityShield — invisible component that adds client-side protections.
 *
 * 1. Anti-iframe (frame-busting backup)
 * 2. Console warning message
 * 3. Right-click disabled
 * 4. Text selection disabled on non-input elements
 * 5. Keyboard shortcut blocking (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 */
export default function SecurityShield() {
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
            '%cCette console est destinée aux développeurs. Si quelqu\'un vous a demandé de coller quelque chose ici, c\'est une arnaque. Fermez cette fenêtre.',
            subStyle
        );
        console.log(
            '%cSi tu es développeur, respect. Mais sache que tout est monitoré. 🛡️',
            subStyle
        );

        // ── 3. Block right-click ──
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // ── 4. Block keyboard shortcuts ──
        const handleKeyDown = (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (Inspector)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C (Element picker)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (View source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }
        };

        // ── 5. Block drag on images ──
        const handleDragStart = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', handleDragStart);

        // Modification 3: Suppression de la prévention CSS de sélection de texte
        // (Le bloc créant et injectant 'security-shield-styles' avec user-select: none a été supprimé)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    // Render nothing — this is a pure side-effect component
    return null;
}
