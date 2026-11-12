import { FaArrowRight, FaDiscord, FaGithub, FaGlobe } from 'react-icons/fa';
import { PROJECTS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';

const LINK_META = {
    github: { icon: FaGithub, label: (t) => t.common.repo },
    website: { icon: FaGlobe, label: (t, p) => p.actionLabel || t.common.website },
    discord: { icon: FaDiscord, label: () => 'Discord' },
};

function Story({ label, children }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-2 py-5 rule-top">
            <dt className="type-label pt-0.5">{label}</dt>
            <dd className="text-txt-secondary max-w-measure">{children}</dd>
        </div>
    );
}

function ProjectCase({ project, copy, labels, featured }) {
    const { t } = useTranslation();
    const approach = Array.isArray(copy.approach) ? copy.approach : [copy.approach].filter(Boolean);

    return (
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8">
            <header className="lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)] self-start">
                <div className="flex items-center gap-3">
                    {project.mark && (
                        <img
                            src={project.mark}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    )}
                    <h3 className={`type-h3 text-txt-primary ${featured ? 'lg:text-[2.125rem]' : ''}`}>
                        {copy.title}
                    </h3>
                </div>

                <p className="type-data text-txt-muted mt-4 leading-relaxed">
                    <span className="sr-only">{labels.stack} : </span>
                    {project.stack.join(' · ')}
                </p>

                {project.links?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-x-6">
                        {project.links.map((link) => {
                            const meta = LINK_META[link.type];
                            const Icon = meta.icon;
                            return (
                                <li key={link.url + link.type}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 min-h-[44px] text-[0.9375rem] font-medium text-txt-primary hover:text-accent-strong transition-colors"
                                    >
                                        <Icon aria-hidden className="text-sm text-txt-muted group-hover:text-current transition-colors" />
                                        {meta.label(t, copy)}
                                        <FaArrowRight
                                            aria-hidden
                                            className="text-[10px] -rotate-45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </header>

            <dl className="lg:col-span-8">
                {copy.problem && <Story label={labels.problem}>{copy.problem}</Story>}
                {approach.length > 0 && (
                    <Story label={labels.approach}>
                        {approach.map((paragraph) => (
                            <p key={paragraph.slice(0, 24)} className="[&+p]:mt-4">
                                {paragraph}
                            </p>
                        ))}
                    </Story>
                )}
                {copy.result && (
                    <Story label={labels.result}>
                        <span className="text-txt-primary">{copy.result}</span>
                    </Story>
                )}
                {copy.learning && <Story label={labels.learning}>{copy.learning}</Story>}
            </dl>
        </article>
    );
}

export default function ProjectsSection() {
    const { t } = useTranslation();
    const labels = t.projectsSection;

    return (
        <div>
            <SectionHeading title={labels.title} description={labels.intro} />

            <div className="space-y-20 sm:space-y-28">
                {PROJECTS.map((project, index) => {
                    const copy = t.projects[project.id];
                    if (!copy) return null;
                    return (
                        <ProjectCase
                            key={project.id}
                            project={project}
                            copy={copy}
                            labels={labels}
                            featured={index === 0}
                        />
                    );
                })}
            </div>
        </div>
    );
}
