import { FaDiscord, FaGithub, FaInstagram, FaSteam, FaTerminal } from 'react-icons/fa';

const NAV_LINKS = [
    { label: 'Accueil', href: '#home' },
    { label: 'Projets', href: '#projects' },
    { label: 'Crystal', href: '#crystal' },
    { label: 'Gaming', href: '#gaming' },
    { label: 'Contact', href: '#contact' },
];

const SOCIAL_LINKS = [
    { icon: FaDiscord, href: 'https://discord.gg/evhpge7UCE', label: 'Discord' },
    { icon: FaGithub, href: 'https://github.com/Clem94220?tab=repositories', label: 'GitHub' },
    { icon: FaInstagram, href: 'https://www.instagram.com/clem94_220', label: 'Instagram' },
    { icon: FaSteam, href: 'https://steamcommunity.com/id/947616406464/', label: 'Steam' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="relative border-t border-white/10">
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-3">
                        <h3 className="text-lg font-display font-bold silver-text-gradient">Clem</h3>
                        <p className="text-xs text-txt-muted leading-relaxed max-w-xs">
                            Developpeur full-stack passionne par le web, la perf et les projets concrets.
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                            <FaTerminal className="text-[10px] text-txt-muted" />
                            <span className="text-[10px] font-mono text-txt-muted tracking-wider">
                                SYSTEM.STATUS: <span className="text-[var(--green)]">ONLINE</span>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-display text-txt-secondary">Navigation</h4>
                        <nav className="flex flex-col gap-1.5">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-sm text-txt-muted hover:text-txt-primary transition-colors w-fit"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-display text-txt-secondary">Connexions</h4>
                        <div className="flex gap-2">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-txt-muted hover:text-txt-primary hover:border-white/25 transition-all"
                                    aria-label={social.label}
                                    title={social.label}
                                >
                                    <social.icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                        <a
                            href="https://crystal-solution.sellhub.cx/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-txt-muted hover:text-txt-primary transition-colors"
                        >
                            Crystal Solution &rarr;
                        </a>
                    </div>
                </div>

                <div className="pt-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[11px] text-txt-muted font-mono">
                        &copy; {year} Clem. All rights reserved.
                    </p>
                    <p className="text-[10px] text-txt-muted font-mono tracking-wider opacity-50">
                        v1.0.0 // BUILT WITH REACT + VITE
                    </p>
                </div>
            </div>
        </footer>
    );
}
