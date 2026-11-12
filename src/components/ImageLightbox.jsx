import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

/**
 * Agrandit une image par-dessus la page sans quitter le site.
 * Rendu dans <body> via un portal : les sections animées (transform) cassent position:fixed.
 */
export default function ImageLightbox({ images, index, onClose, onChange }) {
    const isOpen = index !== null && index >= 0 && index < images.length;
    const hasMany = images.length > 1;
    const dialogRef = useRef(null);
    const returnFocusRef = useRef(null);

    // Accessibilité clavier : on mémorise l'élément qui a ouvert la visionneuse
    // pour lui rendre le focus à la fermeture. La capture se fait au rendu, avant
    // que l'autoFocus du bouton « Fermer » ne déplace le focus.
    const wasOpenRef = useRef(false);
    if (isOpen && !wasOpenRef.current && typeof document !== 'undefined') {
        returnFocusRef.current = document.activeElement;
    }
    wasOpenRef.current = isOpen;

    useEffect(() => {
        if (!isOpen) return;
        return () => {
            const el = returnFocusRef.current;
            if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
        };
    }, [isOpen]);

    const prev = () => onChange((index - 1 + images.length) % images.length);
    const next = () => onChange((index + 1) % images.length);

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'Tab' && dialogRef.current) {
                // Le focus reste dans la visionneuse tant qu'elle est ouverte.
                const focusables = [...dialogRef.current.querySelectorAll('button')];
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (!dialogRef.current.contains(document.activeElement)) {
                    event.preventDefault();
                    first.focus();
                } else if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            } else if (hasMany && event.key === 'ArrowLeft') {
                onChange((index - 1 + images.length) % images.length);
            } else if (hasMany && event.key === 'ArrowRight') {
                onChange((index + 1) % images.length);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, index, images.length, hasMany, onClose, onChange]);

    const current = isOpen ? images[index] : null;

    return createPortal(
        <AnimatePresence>
            {current && (
                <m.div
                    key="lightbox"
                    ref={dialogRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-10"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label={current.alt}
                >
                    <m.img
                        key={current.src}
                        src={current.src}
                        alt={current.alt}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
                        onClick={(event) => event.stopPropagation()}
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Fermer / Close"
                        autoFocus
                    >
                        <FaTimes />
                    </button>

                    {hasMany && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); prev(); }}
                                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                                aria-label="Image précédente / Previous"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); next(); }}
                                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                                aria-label="Image suivante / Next"
                            >
                                <FaChevronRight />
                            </button>
                            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-white/70">
                                {index + 1} / {images.length}
                            </span>
                        </>
                    )}
                </m.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
