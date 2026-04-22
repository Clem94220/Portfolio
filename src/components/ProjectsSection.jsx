import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { PROJECTS } from '../data/portfolioData';
import SectionHeading from './SectionHeading';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProjectsSection() {
    return (
        <div className="space-y-6">
            <SectionHeading
                title="Projets"
                description="Quelques projets qui representent bien ma facon de travailler et de livrer."
            />

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5"
            >
                {PROJECTS.map((project) => (
                    <motion.article
                        key={project.title}
                        variants={item}
                        whileHover={{ y: -6, scale: 1.01 }}
                        className="crystal-card shine-card overflow-hidden h-full flex flex-col"
                    >
                        <div className="h-36 overflow-hidden border-b border-white/10 bg-black/20 relative">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-80 img-zoom"
                                loading="lazy"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                        <div className="p-5 space-y-4 flex-1 flex flex-col">
                            <div className="space-y-2">
                                <h3 className="text-lg font-display font-semibold text-txt-primary">{project.title}</h3>
                                <p className="text-sm text-txt-secondary leading-relaxed">{project.summary}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {project.stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs border border-white/10 bg-white/[0.02] text-txt-secondary"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <p className="text-xs text-txt-muted">{project.impact}</p>

                            <div className="flex gap-2 mt-auto">
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-txt-secondary hover:text-txt-primary hover:border-white/30 transition-colors"
                                >
                                    <FaGithub className="text-sm" />
                                    Repo
                                </a>
                                <a
                                    href={project.demoUrl}
                                    target={project.demoUrl.startsWith('#') ? undefined : '_blank'}
                                    rel={project.demoUrl.startsWith('#') ? undefined : 'noopener noreferrer'}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black px-3 py-2 text-sm hover:brightness-95 transition-all"
                                >
                                    <FaExternalLinkAlt className="text-xs" />
                                    Demo
                                </a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </motion.div>
        </div>
    );
}
