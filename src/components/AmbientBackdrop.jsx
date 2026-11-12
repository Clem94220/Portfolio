import { useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';

// Lumière d'ambiance derrière le haut de page, pilotée par la présence Discord :
// - en écoute sur Spotify : la pochette de l'album, très floutée ;
// - sinon : une lueur à la couleur du statut (en ligne, absent, occupé).
// Elle s'efface au défilement (--hero-fade, calculé dans App.jsx).
const STATUS_TINT = {
    online: '35, 165, 90',
    idle: '240, 178, 50',
    dnd: '242, 63, 67',
    offline: '56, 189, 248',
};

export default function AmbientBackdrop({ data }) {
    const art = data?.listening_to_spotify ? data.spotify?.album_art_url : null;
    const tint = STATUS_TINT[data?.discord_status] || STATUS_TINT.offline;
    const layerKey = art || `status-${tint}`;

    // La couleur du statut est partagée avec les particules du fond (AnimatedBackground).
    useEffect(() => {
        document.documentElement.style.setProperty('--ambient-tint', tint);
    }, [tint]);

    return (
        <div className="ambient" data-mode={art ? 'art' : 'status'} aria-hidden>
            <AnimatePresence initial={false}>
                <m.div
                    key={layerKey}
                    className="ambient-layer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {art ? (
                        <img src={art} alt="" className="ambient-art" decoding="async" />
                    ) : (
                        <div className="ambient-glow" style={{ '--tint': tint }} />
                    )}
                </m.div>
            </AnimatePresence>
        </div>
    );
}
