import { useCallback, useEffect, useRef, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import TabNav from './components/TabNav';
import NeonHud from './components/NeonHud';
import Toast from './components/Toast';
import PageLoader from './components/PageLoader';
import HomeSection from './components/HomeSection';
const StatsSection = lazy(() => import('./components/StatsSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const CrystalSection = lazy(() => import('./components/CrystalSection'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const GamingSection = lazy(() => import('./components/GamingSection'));
const CommunitySection = lazy(() => import('./components/CommunitySection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import BackToTopButton from './components/BackToTopButton';
import SecurityShield from './components/SecurityShield';
import { useLanyard } from './hooks/useLanyard';
import { useViewCounter } from './hooks/useViewCounter';

const SECTIONS = ['home', 'projects', 'crystal', 'about', 'gaming', 'community', 'contact'];

const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: {
        scaleX: 1,
        opacity: 1,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

function SectionDivider() {
    return (
        <motion.div
            variants={dividerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="h-px mx-auto max-w-xl origin-center"
            style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
            }}
        />
    );
}

// Modification 2: Composant pour l'effet Scroll Reveal
function ScrollReveal({ children, id }) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.section>
    );
}

export default function App() {
    const [activeSection, setActiveSection] = useState('home');
    const activeSectionRef = useRef('home');
    const crosshairRef = useRef(null);
    const lanyard = useLanyard();
    const { totalViews, activeNow } = useViewCounter();

    const setSection = useCallback((id) => {
        if (activeSectionRef.current === id) return;
        activeSectionRef.current = id;
        setActiveSection(id);
        if (window.location.hash !== `#${id}`) {
            window.history.replaceState(null, '', `#${id}`);
        }
    }, []);

    useEffect(() => {
        const observers = [];

        SECTIONS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setSection(id);
                    }
                },
                { rootMargin: '-42% 0px -48% 0px', threshold: 0 }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((observer) => observer.disconnect());
    }, [setSection]);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && SECTIONS.includes(hash)) {
            setSection(hash);
            setTimeout(() => {
                const target = document.getElementById(hash);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 180);
        }
    }, [setSection]);

    useEffect(() => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const crosshairEl = crosshairRef.current;
        if (!crosshairEl) return;

        const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let lastX = -1;
        let lastY = -1;
        let frame = null;

        const commitPointer = () => {
            if (lastX === pointer.x && lastY === pointer.y) {
                frame = null;
                return;
            }

            crosshairEl.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
            lastX = pointer.x;
            lastY = pointer.y;
            frame = null;
        };

        const handlePointerMove = (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            if (frame === null) frame = requestAnimationFrame(commitPointer);
        };

        commitPointer();
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    useEffect(() => {
        let frame = null;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
            frame = null;
        };

        const handleScroll = () => {
            if (frame === null) frame = requestAnimationFrame(updateProgress);
        };

        updateProgress();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col">
            <PageLoader />
            <SecurityShield />

            <div ref={crosshairRef} className="site-crosshair" aria-hidden />

            <AnimatedBackground />
            <Toast />

            <header
                className="sticky top-0 z-40 backdrop-blur-xl border-b border-[var(--border-crystal)]"
                style={{ background: 'rgba(5,7,9,0.82)' }}
            >
                <div className="max-w-6xl mx-auto w-full">
                    <TabNav activeSection={activeSection} />
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 sm:space-y-14">
                <ScrollReveal id="home">
                    <HomeSection lanyard={lanyard} />
                </ScrollReveal>

                <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="loader-dot w-4 h-4 rounded-full bg-[var(--accent)]" /></div>}>
                    <SectionDivider />

                    <StatsSection />

                    <SectionDivider />

                    <ScrollReveal id="projects">
                        <ProjectsSection />
                    </ScrollReveal>

                    <SectionDivider />

                    <ScrollReveal id="crystal">
                        <CrystalSection />
                    </ScrollReveal>

                    <SectionDivider />

                    <ScrollReveal id="about">
                        <AboutSection />
                    </ScrollReveal>

                    <SectionDivider />

                    <ScrollReveal id="gaming">
                        <GamingSection />
                    </ScrollReveal>

                    <SectionDivider />

                    <ScrollReveal id="community">
                        <CommunitySection />
                    </ScrollReveal>

                    <SectionDivider />

                    <ScrollReveal id="contact">
                        <ContactSection />
                    </ScrollReveal>
                </Suspense>
            </main>

            <div className="h-20 sm:h-10 w-full" />

            <Footer />
            <NeonHud totalViews={totalViews} activeNow={activeNow} />
            <BackToTopButton />
            <MusicPlayer />
        </div>
    );
}
