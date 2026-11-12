import { useCallback, useEffect, useRef, useState, Suspense, lazy } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import AmbientBackdrop from './components/AmbientBackdrop';
import TabNav from './components/TabNav';
import NeonHud from './components/NeonHud';
import Toast from './components/Toast';
import HomeSection from './components/HomeSection';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import BackToTopButton from './components/BackToTopButton';
import SecurityShield from './components/SecurityShield';
import { useLanyard } from './hooks/useLanyard';
import { useViewCounter } from './hooks/useViewCounter';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';

const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const CrystalSection = lazy(() => import('./components/CrystalSection'));
const ApproachSection = lazy(() => import('./components/ApproachSection'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const SideSection = lazy(() => import('./components/SideSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));

// Les fonctionnalités d'animation sont chargées à part, après le premier affichage.
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

const SECTIONS =['home', 'projects', 'crystal', 'approach', 'about', 'side', 'contact'];

function Section({ id, children, className = '' }) {
    return (
        <section id={id} className={`py-20 sm:py-28 ${className}`}>
            {children}
        </section>
    );
}

function MainApp() {
    const [activeSection, setActiveSection] = useState('home');
    const activeSectionRef = useRef('home');
    const lanyard = useLanyard();
    const { totalViews, activeNow } = useViewCounter();
    const { t, language, setLanguage } = useTranslation();

    const setSection = useCallback((id) => {
        if (activeSectionRef.current === id) return;
        activeSectionRef.current = id;
        setActiveSection(id);
        if (window.location.hash !== `#${id}`) {
            window.history.replaceState(null, '', `#${id}`);
        }
    }, []);

    // Section active dans la navigation. Les sections chargées en différé
    // apparaissent après coup : on observe le DOM jusqu'à les trouver toutes.
    useEffect(() => {
        const observed = new Set();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setSection(entry.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );

        const attach = () => {
            SECTIONS.forEach((id) => {
                const el = document.getElementById(id);
                if (el && !observed.has(el)) {
                    observed.add(el);
                    observer.observe(el);
                }
            });
            return observed.size === SECTIONS.length;
        };

        let mutation = null;
        if (!attach()) {
            mutation = new MutationObserver(() => {
                if (attach()) mutation.disconnect();
            });
            mutation.observe(document.getElementById('main'), { childList: true, subtree: true });
        }

        return () => {
            observer.disconnect();
            if (mutation) mutation.disconnect();
        };
    }, [setSection]);

    // Arrivée sur une ancre (#projects…) : on attend que la section existe.
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (!hash || !SECTIONS.includes(hash) || hash === 'home') return;
        let tries = 0;
        const timer = setInterval(() => {
            const target = document.getElementById(hash);
            if (target || tries > 20) {
                clearInterval(timer);
                if (target) target.scrollIntoView();
            }
            tries += 1;
        }, 100);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let frame = null;

        const updateProgress = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
            const heroFade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9));
            document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
            document.documentElement.style.setProperty('--hero-fade', heroFade.toFixed(3));
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

    // Raccourcis : M = musique, L = langue. Espace garde son comportement normal (défiler).
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const el = document.activeElement;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;

            const key = event.key.toLowerCase();
            if (key === 'm') {
                window.dispatchEvent(new CustomEvent('toggle-music'));
            } else if (key === 'l') {
                setLanguage(language === 'fr' ? 'en' : 'fr');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [language, setLanguage]);

    return (
        <div className="relative min-h-screen flex flex-col">
            <SecurityShield />
            <AnimatedBackground />
            <AmbientBackdrop data={lanyard.data} />
            <Toast />

            <TabNav activeSection={activeSection} />

            <main id="main" className="flex-1 w-full max-w-page mx-auto px-4 sm:px-8">
                <section id="home">
                    <HomeSection lanyard={lanyard} />
                </section>

                <Suspense
                    fallback={
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <div className="loader-dot w-3 h-3 rounded-full bg-[var(--accent)]" />
                        </div>
                    }
                >
                    <Section id="projects" className="rule-top">
                        <ProjectsSection />
                    </Section>

                    <Section id="crystal" className="band">
                        <CrystalSection />
                    </Section>

                    <Section id="approach">
                        <ApproachSection />
                    </Section>

                    <Section id="about" className="rule-top">
                        <AboutSection />
                    </Section>

                    <Section id="side" className="rule-top">
                        <SideSection />
                    </Section>

                    <Section id="contact" className="band">
                        <ContactSection />
                    </Section>
                </Suspense>
            </main>

            <Footer totalViews={totalViews} activeNow={activeNow} />
            <NeonHud totalViews={totalViews} activeNow={activeNow} />
            <BackToTopButton />
            <MusicPlayer />
        </div>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <MotionConfig reducedMotion="user">
                <LazyMotion features={loadMotionFeatures} strict>
                    <MainApp />
                </LazyMotion>
            </MotionConfig>
        </LanguageProvider>
    );
}
