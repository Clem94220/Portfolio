import { SiC, SiReact, SiCplusplus, SiJavascript } from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { FaArrowRight, FaDiscord, FaGithub, FaInstagram, FaSpotify, FaSteam } from 'react-icons/fa';
import { CONTACT_LINKS, DISCORD_DM_URL, PROOF_LINKS, SKILLS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import LanyardCard from './LanyardCard';

const ICON_MAP = { SiC, SiCplusplus, SiReact, FaJava, SiJavascript };

const linkOf = (icon) => CONTACT_LINKS.find((link) => link.icon === icon)?.url;

// Tes profils, dans l'ordre où tu les as donnés. Discord ouvre ton profil (pas le serveur).
const SOCIALS = [
    { label: 'Discord', url: DISCORD_DM_URL, icon: FaDiscord, color: '#5865F2' },
    { label: 'Instagram', url: linkOf('instagram'), icon: FaInstagram, color: '#E1306C' },
    { label: 'Steam', url: linkOf('steam'), icon: FaSteam, color: '#C7D5E0' },
    { label: 'Spotify', url: linkOf('spotify'), icon: FaSpotify, color: '#1DB954' },
    { label: 'GitHub', url: PROOF_LINKS.github, icon: FaGithub, color: '#F2F3F5' },
];

export default function HomeSection({ lanyard }) {
    const { t } = useTranslation();

    const goToProjects = (event) => {
        event.preventDefault();
        document.getElementById('projects')?.scrollIntoView();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-14 pt-16 sm:pt-24 pb-20 sm:pb-28">
            <div className="lg:col-span-8">
                <h1 className="type-display text-txt-primary hero-reveal">{t.hero.name}</h1>

                <p className="type-lead text-txt-primary mt-8 max-w-[30ch] hero-fade" style={{ '--delay': '0.3s' }}>
                    {t.hero.lead}
                </p>

                <p className="prose-body mt-6 hero-fade" style={{ '--delay': '0.42s' }}>
                    {t.hero.body}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-3 hero-fade" style={{ '--delay': '0.54s' }}>
                    <a href="#projects" onClick={goToProjects} className="btn btn-primary">
                        {t.hero.ctaProjects}
                        <FaArrowRight className="btn-arrow text-xs" aria-hidden />
                    </a>
                    <a href={PROOF_LINKS.cv} className="btn btn-ghost">
                        {t.hero.ctaCv}
                    </a>
                </div>

                <ul
                    className="mt-8 flex flex-wrap items-center gap-2 hero-fade"
                    style={{ '--delay': '0.62s' }}
                    aria-label={t.hero.socialsLabel}
                >
                    {SOCIALS.map(({ label, url, icon: Icon, color }) => (
                        <li key={label}>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 h-10 pl-3 pr-3.5 rounded-full border border-[var(--rule)] text-sm font-medium text-txt-secondary hover:text-txt-primary hover:border-[var(--social)] hover:bg-white/[0.04] transition-colors"
                                style={{ '--social': color }}
                            >
                                <Icon
                                    aria-hidden
                                    className="text-[15px] transition-colors duration-200 group-hover:text-[var(--social)]"
                                />
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                <p className="type-label mt-8 hero-fade" style={{ '--delay': '0.7s' }}>
                    {t.hero.meta}
                </p>
            </div>

            <div className="lg:col-span-4 lg:pt-4 space-y-10 hero-fade" style={{ '--delay': '0.6s' }}>
                <div>
                    <p className="type-label mb-3">{t.hero.presenceLabel}</p>
                    <LanyardCard data={lanyard.data} loading={lanyard.loading} error={lanyard.error} />
                </div>

                <div>
                    <p className="type-label mb-3">{t.hero.stackLabel}</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-3">
                        {SKILLS.map((skill) => {
                            const Icon = ICON_MAP[skill.icon];
                            return (
                                <li
                                    key={skill.label}
                                    className="group inline-flex items-center gap-2 text-[0.9375rem] text-txt-secondary"
                                >
                                    {Icon && (
                                        <Icon
                                            aria-hidden
                                            className="text-base text-txt-muted transition-colors duration-300 group-hover:text-[var(--skill)]"
                                            style={{ '--skill': skill.color }}
                                        />
                                    )}
                                    {skill.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
