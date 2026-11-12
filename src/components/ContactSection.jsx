import { FaArrowRight, FaDiscord, FaGithub } from 'react-icons/fa';
import { CONTACT_LINKS, DISCORD_DM_URL, DISCORD_INVITE_CODE, PROOF_LINKS } from '../data/portfolioData';
import { useDiscordInvite } from '../hooks/useDiscordInvite';
import { useTranslation } from '../contexts/LanguageContext';
import LinkIcon from './LinkIcon';

export default function ContactSection() {
    const { t, language } = useTranslation();
    const { members, online } = useDiscordInvite(DISCORD_INVITE_CODE);
    const fmt = (n) => n.toLocaleString(language === 'en' ? 'en-US' : 'fr-FR');

    const elsewhere = [
        { label: 'GitHub', url: PROOF_LINKS.github, icon: 'github' },
        ...CONTACT_LINKS.filter((link) => link.icon !== 'discord'),
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
            <div className="lg:col-span-8">
                <h2 className="type-h2 text-txt-primary max-w-[18ch]">{t.contact.title}</h2>
                <p className="prose-body mt-6">{t.contact.text}</p>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <a
                        href={`https://discord.gg/${DISCORD_INVITE_CODE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        <FaDiscord aria-hidden />
                        {t.common.openDiscord}
                        <FaArrowRight className="btn-arrow text-xs" aria-hidden />
                    </a>
                    <a href={DISCORD_DM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        {t.contact.dm}
                    </a>
                </div>

                {(members !== null || online !== null) && (
                    <p className="type-data text-txt-muted mt-5">
                        {online !== null && (
                            <span className="inline-flex items-center gap-2 mr-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" aria-hidden />
                                {fmt(online)} {language === 'en' ? 'online' : 'en ligne'}
                            </span>
                        )}
                        {members !== null && (
                            <span>
                                {fmt(members)} {language === 'en' ? 'members' : 'membres'}
                            </span>
                        )}
                    </p>
                )}
            </div>

            <div className="lg:col-span-4 lg:pt-3">
                <h3 className="type-label mb-2">{t.contact.elsewhere}</h3>
                <ul>
                    {elsewhere.map((link) => (
                        <li key={link.label} className="rule-top">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between gap-3 py-3.5 text-txt-secondary hover:text-txt-primary transition-colors"
                            >
                                <span className="inline-flex items-center gap-3">
                                    {link.icon === 'github' ? (
                                        <FaGithub aria-hidden className="text-sm" />
                                    ) : (
                                        <LinkIcon name={link.icon} />
                                    )}
                                    {link.label}
                                </span>
                                <FaArrowRight
                                    aria-hidden
                                    className="text-[10px] -rotate-45 text-txt-muted transition-all duration-200 group-hover:text-accent-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
