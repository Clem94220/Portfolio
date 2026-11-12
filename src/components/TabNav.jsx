import { useTranslation } from '../contexts/LanguageContext';

const LINKS = ['projects', 'crystal', 'approach', 'about', 'side', 'contact'];

export default function TabNav({ activeSection }) {
    const { t, language, setLanguage } = useTranslation();

    const goTo = (event, id) => {
        event.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
        if (id === 'home') window.history.replaceState(null, '', window.location.pathname);
    };

    return (
        <header
            className="sticky top-0 z-40 border-b border-[var(--rule)] backdrop-blur-md"
            style={{ background: 'rgba(5, 7, 10, 0.86)' }}
        >
            <a href="#main" className="skip-link">
                {t.ui.skipToContent}
            </a>
            <div className="relative max-w-page mx-auto px-4 sm:px-8 flex flex-wrap md:flex-nowrap items-center gap-x-6 min-h-[var(--header-h)]">
                <a
                    href="#home"
                    onClick={(e) => goTo(e, 'home')}
                    className="py-3 font-display font-extrabold text-lg tracking-[-0.02em] text-txt-primary hover:text-accent-strong transition-colors"
                    style={{ fontStretch: '125%' }}
                >
                    Clément
                </a>

                <nav
                    aria-label={t.ui.menu}
                    className="order-3 md:order-none basis-full md:basis-auto md:ml-auto -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide"
                >
                    <ul className="flex items-center gap-1 min-w-max pb-2 md:pb-0">
                        {LINKS.map((id) => {
                            const active = activeSection === id;
                            return (
                                <li key={id}>
                                    <a
                                        href={`#${id}`}
                                        onClick={(e) => goTo(e, id)}
                                        aria-current={active ? 'location' : undefined}
                                        className={`relative block px-3 py-2 rounded-md text-[0.9375rem] font-medium transition-colors ${
                                            active
                                                ? 'text-txt-primary'
                                                : 'text-txt-muted hover:text-txt-primary'
                                        }`}
                                    >
                                        {t.nav[id]}
                                        <span
                                            aria-hidden
                                            className={`absolute left-3 right-3 -bottom-px h-px bg-[var(--accent)] origin-left transition-transform duration-300 ${
                                                active ? 'scale-x-100' : 'scale-x-0'
                                            }`}
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <button
                    type="button"
                    onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                    aria-label={t.ui.switchLanguage}
                    title={`${t.ui.switchLanguage} (L)`}
                    className="ml-auto md:ml-0 type-data inline-flex items-center justify-center h-11 min-w-[44px] px-2 rounded-md border border-[var(--rule)] text-txt-secondary hover:text-txt-primary hover:border-[var(--accent)] transition-colors"
                >
                    {t.ui.switchLanguageShort}
                </button>

                <div className="scroll-progress" aria-hidden />
            </div>
        </header>
    );
}
