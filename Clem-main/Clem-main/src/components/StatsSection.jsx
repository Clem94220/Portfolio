import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaGamepad, FaLayerGroup, FaClock } from 'react-icons/fa';
import { SKILLS } from '../data/portfolioData';

const STATS = [
    { icon: FaCode, value: 3, suffix: '+', label: 'Projets livres' },
    { icon: FaLayerGroup, value: SKILLS.length, suffix: '', label: 'Technologies' },
    { icon: FaGamepad, value: 1000, suffix: '', prefix: 'Top ', label: 'Gaming Global' },
    { icon: FaClock, value: 2, suffix: '+ ans', label: "d'experience" },
];

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = performance.now();

                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.round(eased * target));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref} className="counter-value text-3xl sm:text-4xl font-display font-bold text-txt-primary tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function StatsSection() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
            {STATS.map((stat) => (
                <motion.div
                    key={stat.label}
                    variants={item}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="crystal-card p-5 sm:p-6 flex flex-col items-center text-center gap-2 group"
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"
                        style={{ background: 'var(--accent-subtle)' }}
                    >
                        <stat.icon className="text-lg text-txt-primary" />
                    </div>
                    <AnimatedCounter
                        target={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                    />
                    <p className="text-xs sm:text-sm text-txt-muted uppercase tracking-wider">
                        {stat.label}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}
