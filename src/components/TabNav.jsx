import { motion } from 'framer-motion';

const TABS = [
    { id: 'home', label: 'Accueil' },
    { id: 'projects', label: 'Projets' },
    { id: 'crystal', label: 'Crystal' },
    { id: 'about', label: 'Parcours' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'community', label: 'Communaute' },
    { id: 'contact', label: 'Contact' },
];

export default function TabNav({ activeSection }) {
    const handleClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full overflow-x-auto scrollbar-hide relative">
            <nav
                className="relative flex items-center justify-start sm:justify-center gap-1.5 px-4 py-3 min-w-max mx-auto"
                aria-label="Navigation principale"
            >
                {TABS.map((tab) => (
                    <a
                        key={tab.id}
                        href={`#${tab.id}`}
                        onClick={(e) => handleClick(e, tab.id)}
                        className={`relative px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold font-display tracking-[0.16em] uppercase rounded-lg transition-colors duration-200 ${activeSection === tab.id
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
            <div className="scroll-progress" />
        </div>
    );
}
