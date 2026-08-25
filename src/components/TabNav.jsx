import { motion } from 'framer-motion';
import { FaDiscord, FaInstagram, FaSpotify, FaSteam } from 'react-icons/fa';
import { useTranslation } from '../contexts/LanguageContext';

const HEADER_SOCIALS = [
    { icon: FaDiscord, href: 'https://discord.gg/evhpge7UCE', label: 'Discord', color: '#5865f2' },
    { icon: FaSpotify, href: 'https://open.spotify.com/user/31nasvp5d3r2h2n2ivecywukzmje', label: 'Spotify', color: '#1db954' },
    { icon: FaInstagram, href: 'https://www.instagram.com/clem94_220', label: 'Instagram', color: '#e1306c' },
    { icon: FaSteam, href: 'https://steamcommunity.com/id/947616406464/', label: 'Steam', color: '#ffffff' },
];

export default function TabNav({ activeSection }) {
    const { t } = useTranslation();

    const TABS = [
        { id: 'home', label: t.nav.home },
        { id: 'projects', label: t.nav.projects },
        { id: 'crystal', label: t.nav.crystal },
        { id: 'about', label: t.nav.about },
        { id: 'gaming', label: t.nav.gaming },
        { id: 'community', label: t.nav.community },
        { id: 'contact', label: t.nav.contact },
    ];

    const handleClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full relative px-2 sm:px-4">
            <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide py-2 sm:py-2.5">
                {/* Navigation Section Tabs */}
                <nav
                    className="flex items-center gap-1 min-w-max"
                    aria-label="Navigation principale"
                >
                    {TABS.map((tab) => (
                        <a
                            key={tab.id}
                            href={`#${tab.id}`}
                            onClick={(e) => handleClick(e, tab.id)}
                            className={`relative px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold font-display tracking-[0.14em] uppercase rounded-lg transition-colors duration-200 ${
                                activeSection === tab.id
                                    ? 'text-accent'
                                    : 'text-txt-muted hover:text-txt-secondary'
                            }`}
                            style={activeSection === tab.id ? { color: 'var(--accent)' } : {}}
                        >
                            {tab.label}
                            {activeSection === tab.id && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                                    style={{
                                        background: 'var(--accent)',
                                        boxShadow: '0 0 8px var(--accent-glow)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </a>
                    ))}
                </nav>

                {/* Header Social Icons (Discord, Spotify, Instagram, Steam) */}
                <div className="flex items-center gap-1 sm:gap-1.5 pl-2 sm:pl-3 border-l border-white/10 min-w-max">
                    {HEADER_SOCIALS.map((social) => (
                        <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.15, y: -1 }}
                            whileTap={{ scale: 0.92 }}
                            aria-label={social.label}
                            title={social.label}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.02] text-txt-muted hover:text-white hover:border-white/30 transition-colors"
                        >
                            <social.icon className="text-xs sm:text-sm" />
                        </motion.a>
                    ))}
                </div>
            </div>
            <div className="scroll-progress" />
        </div>
    );
}
