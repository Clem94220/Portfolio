import { FaArrowRight } from 'react-icons/fa';
import { CONTACT_LINKS, PROOF_LINKS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';
import LinkIcon from './LinkIcon';

function linkStyle(priority) {
    if (priority === 'primary') {
        return 'bg-white text-black border-transparent hover:brightness-95';
    }
    return 'bg-transparent text-txt-secondary border-white/15 hover:text-txt-primary hover:border-white/30';
}

export default function ContactSection() {
    const { t } = useTranslation();
    const isExternal = (url) => url.startsWith('http');

    const translatedProofLinks = PROOF_LINKS.map(link => {
        if (link.icon === 'project') {
            return { ...link, label: t.profile.viewProjects };
        }
        return link;
    });

    return (
        <div className="space-y-6">
            <SectionHeading
                title={t.contact.headingTitle}
                description={t.contact.headingDesc}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                <article className="crystal-card p-6 sm:p-7 space-y-5">
                    <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-display font-semibold text-txt-primary">
                            {t.contact.cardTitle}
                        </h3>
                        <p className="text-sm sm:text-base text-txt-secondary max-w-xl leading-relaxed">
                            {t.contact.cardText}
                        </p>
                    </div>

                    <a
                        href="https://discord.gg/evhpge7UCE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-3 text-sm font-semibold hover:brightness-95 transition-all"
                    >
                        {t.common.openDiscord}
                        <FaArrowRight className="text-xs" />
                    </a>

                    <div className="flex flex-wrap gap-2">
                        {CONTACT_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${linkStyle(link.priority)}`}
                            >
                                <LinkIcon name={link.icon} />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </article>

                <article className="crystal-card p-6 space-y-3">
                    <h3 className="text-sm uppercase tracking-[0.2em] font-display text-txt-secondary">{t.common.usefulLinks}</h3>
                    <ul className="space-y-2">
                        {translatedProofLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.url}
                                    target={isExternal(link.url) ? '_blank' : undefined}
                                    rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
                                    className="w-full inline-flex items-center justify-between gap-3 rounded-lg border border-white/12 px-3 py-2.5 text-sm text-txt-secondary hover:text-txt-primary hover:border-white/30 transition-colors"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <LinkIcon name={link.icon} />
                                        {link.label}
                                    </span>
                                    <FaArrowRight className="text-xs" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </div>
    );
}
