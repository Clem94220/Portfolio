import { useEffect, useState } from 'react';

// Sur mobile, les boutons flottants se retirent quand on descend dans la page
// (ils couvriraient le texte qu'on lit) et reviennent dès qu'on remonte.
// Sur grand écran, ils restent toujours visibles.
export function useHideOnScroll({ threshold = 160 } = {}) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const mobile = window.matchMedia('(max-width: 639px)');
        let lastY = window.scrollY;
        let frame = null;

        const update = () => {
            frame = null;
            const y = window.scrollY;
            const delta = y - lastY;
            if (!mobile.matches || y < threshold) setHidden(false);
            else if (delta > 6) setHidden(true);
            else if (delta < -6) setHidden(false);
            lastY = y;
        };

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        mobile.addEventListener('change', update);
        return () => {
            window.removeEventListener('scroll', onScroll);
            mobile.removeEventListener('change', update);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, [threshold]);

    return hidden;
}
