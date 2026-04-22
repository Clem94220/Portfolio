import React from 'react';
import { FaHome, FaRedoAlt } from 'react-icons/fa';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Application crash captured by ErrorBoundary', error, info);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleHome = () => {
        window.location.href = '/';
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="min-h-screen px-4 py-10 flex items-center justify-center" style={{ background: 'var(--bg-void)' }}>
                <div className="crystal-card w-full max-w-xl p-7 sm:p-8 text-center">
                    <div className="relative z-10 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.2em] text-txt-secondary">
                            <span className="w-2 h-2 rounded-full bg-[var(--red)]" />
                            Recovery Mode
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold silver-text-gradient">
                                Une erreur a bloque la page
                            </h1>
                            <p className="text-sm sm:text-base text-txt-secondary leading-relaxed">
                                Le site a rencontre un probleme inattendu. Recharge la page pour relancer proprement l interface.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                type="button"
                                onClick={this.handleReload}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black px-4 py-2.5 text-sm font-semibold hover:brightness-95 transition-all"
                            >
                                <FaRedoAlt className="text-xs" />
                                Recharger
                            </button>
                            <button
                                type="button"
                                onClick={this.handleHome}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-txt-secondary hover:text-txt-primary hover:border-white/30 transition-colors"
                            >
                                <FaHome className="text-xs" />
                                Retour a l accueil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
