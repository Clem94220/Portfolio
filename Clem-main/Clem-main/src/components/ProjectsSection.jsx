import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { PROJECTS } from '../data/portfolioData';
import SectionHeading from './SectionHeading';
import SafeImage from './SafeImage';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProjectsSection() {
    const isExternal = (url) => url?.startsWith('http');

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
                        whileHover={{ y: -8, scale: 1.012, rotateX: 1.6 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        className="crystal-card shine-card card-spotlight overflow-hidden h-full flex flex-col"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="h-36 overflow-hidden border-b border-white/10 bg-black/20 relative">
                            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-[0.16em] text-txt-secondary">
                                {project.stack[0]}
                            </div>
                            <SafeImage
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-80 img-zoom"
                                fallbackClassName="w-full h-full flex items-center justify-center bg-white/[0.04]"
                                fallbackLabel={project.title}
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
                                <motion.a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.985 }}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-txt-secondary hover:text-txt-primary hover:border-white/30 transition-colors"
                                >
                                    <FaGithub className="text-sm" />
                                    Repo
                                </motion.a>
                                <motion.a
                                    href={project.demoUrl}
                                    target={isExternal(project.demoUrl) ? '_blank' : undefined}
                                    rel={isExternal(project.demoUrl) ? 'noopener noreferrer' : undefined}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.985 }}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black px-3 py-2 text-sm hover:brightness-95 transition-all"
                                    style={{ boxShadow: '0 10px 30px rgba(255,255,255,0.08)' }}
                                >
                                    <FaExternalLinkAlt className="text-xs" />
                                    Demo
                                </motion.a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </motion.div>
        </div>
    );
}
