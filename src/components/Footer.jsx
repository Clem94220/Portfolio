import { FaDiscord, FaGithub, FaInstagram, FaSpotify, FaSteam } from 'react-icons/fa';
import { CONTACT_LINKS, PROOF_LINKS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';

const ICONS = { discord: FaDiscord, spotify: FaSpotify, instagram: FaInstagram, steam: FaSteam, github: FaGithub };

export default function Footer({ totalViews, activeNow }) {
    const { t, language } = useTranslation();
    const fmt = (n) => (n ?? 0).toLocaleString(language === 'en' ? 'en-US' : 'fr-FR');
    const year = new Date().getFullYear();
    const socials = [...CONTACT_LINKS, { label: 'GitHub', url: PROOF_LINKS.github, icon: 'github' }];

    return (
        <footer className="pb-24 sm:pb-16">
            <div className="max-w-page mx-auto px-4 sm:px-8 pt-10 flex flex-col gap-6">
                <div>
                    <p className="font-extrabold text-lg text-txt-primary" style={{ fontStretch: '125%' }}>
                        Clément
                    </p>
                    <p className="text-sm text-txt-muted mt-1">{t.footer.desc}</p>
                    {/* Sur mobile, le compteur flottant est masqué pour ne pas couvrir le texte : il vit ici. */}
                    <p className="sm:hidden type-data text-txt-muted mt-4 inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" aria-hidden />
                        {t.common.live} · {fmt(totalViews)} {t.ui.views.toLowerCase()} · {fmt(activeNow)} {t.ui.active.toLowerCase()}
                    </p>
                    <p className="type-data text-txt-muted mt-4">
                        © {year} Clément · {t.footer.rights}
                    </p>
                </div>

                <ul className="flex flex-wrap gap-2">
                    {socials.map((social) => {
                        const Icon = ICONS[social.icon];
                        return (
                            <li key={social.label}>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    title={social.label}
                                    className="w-11 h-11 rounded-lg flex items-center justify-center border border-[var(--rule)] text-txt-muted hover:text-txt-primary hover:border-[var(--accent)] transition-colors"
                                >
                                    <Icon aria-hidden className="text-base" />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </footer>
    );
}
