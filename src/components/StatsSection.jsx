import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaClock, FaGamepad } from 'react-icons/fa';
import { useTranslation } from '../contexts/LanguageContext';

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1800 }) {
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
        <span ref={ref} className="counter-value text-2xl sm:text-3xl font-display font-bold text-txt-primary tabular-nums">
            {prefix}{count}{suffix}
        </span>
    );
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function StatsSection() {
    const { t } = useTranslation();

    const STAT_CARDS = [
        {
            icon: FaLaptopCode,
            isCounter: false,
            badgeText: t.stats.card1Value,
            title: t.stats.card1Title,
            description: t.stats.card1Desc,
            color: '#00f0ff',
        },
        {
            icon: FaClock,
            isCounter: true,
            targetValue: t.stats.card2Value,
            suffix: t.stats.card2Suffix,
            title: t.stats.card2Title,
            description: t.stats.card2Desc,
            color: '#ffffff',
        },
        {
            icon: FaGamepad,
            isCounter: false,
            badgeText: t.stats.card3Value,
            title: t.stats.card3Title,
            description: t.stats.card3Desc,
            color: '#a855f7',
        },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
        >
            {STAT_CARDS.map((card) => (
                <motion.div
                    key={card.title}
                    variants={item}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="crystal-card p-6 relative overflow-hidden group border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
                >
                    <div
                        className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                        style={{ background: card.color }}
                    />

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                                style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                            >
                                <card.icon className="text-xl text-txt-primary" />
                            </div>

                            {card.isCounter ? (
                                <AnimatedCounter target={card.targetValue} suffix={card.suffix} />
                            ) : (
                                <span className="text-sm font-display font-bold text-txt-primary tracking-wide border border-white/15 px-3 py-1 rounded-full bg-white/[0.03]">
                                    {card.badgeText}
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold font-display uppercase tracking-wider text-txt-primary">
                                {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed mt-1">
                                {card.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
