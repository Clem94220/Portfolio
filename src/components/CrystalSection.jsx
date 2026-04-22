import { motion } from 'framer-motion';
import { FaCode, FaDiscord, FaGlobe, FaShoppingBag, FaTools } from 'react-icons/fa';
import { SiBitcoin, SiEthereum, SiLitecoin, SiPaypal, SiStripe } from 'react-icons/si';
import {
    CRYSTAL,
    CRYSTAL_CATALOG,
    CRYSTAL_DURATIONS,
    CRYSTAL_FEATURES,
    CRYSTAL_PRICING,
    PAYMENT_METHODS,
} from '../data/portfolioData';
import PaymentCard from './PaymentCard';
import SectionHeading from './SectionHeading';

const ICONS = {
    stripe: { icon: SiStripe, color: '#e2e2e2' },
    paypal: { icon: SiPaypal, color: '#cfd2da' },
    btc: { icon: SiBitcoin, color: '#ffffff' },
    ltc: { icon: SiLitecoin, color: '#b7bcc5' },
    eth: { icon: SiEthereum, color: '#9ca3af' },
};

const FEATURE_ICONS = {
    code: FaCode,
    web: FaGlobe,
    tools: FaTools,
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function CrystalSection() {
    return (
        <div className="space-y-6">
            <SectionHeading
                title="Crystal Solution"
                description="Le projet, la boutique et les moyens de paiement disponibles."
            />

            <motion.div
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="crystal-card p-6 sm:p-7"
            >
                <div className="relative z-10 space-y-5">
                    <div className="flex items-center gap-4">
                        <img
                            src={CRYSTAL.icon}
                            alt="Crystal Solution"
                            className="w-14 h-14 rounded-2xl object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                        <div>
                            <h3 className="text-xl sm:text-2xl font-display font-semibold text-txt-primary">{CRYSTAL.title}</h3>
                            <p className="text-sm text-txt-secondary">{CRYSTAL.description}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href={CRYSTAL.shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2.5 text-sm font-semibold hover:brightness-95 transition-all"
                        >
                            <FaShoppingBag className="text-sm" />
                            Ouvrir la boutique
                        </a>
                        <a
                            href={CRYSTAL.discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm text-txt-secondary hover:text-txt-primary hover:border-white/35 transition-colors"
                        >
                            <FaDiscord className="text-sm" />
                            Discord
                        </a>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
            >
                {CRYSTAL_FEATURES.map((feature) => {
                    const Icon = FEATURE_ICONS[feature.key];
                    return (
                        <motion.article key={feature.title} variants={item} className="crystal-card p-6">
                            <div className="relative z-10 space-y-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                                    style={{ background: 'var(--accent-subtle)' }}
                                >
                                    {Icon ? <Icon className="text-lg text-txt-primary" /> : null}
                                </div>

                                <h3 className="text-lg font-display font-semibold tracking-wide text-txt-primary">
                                    {feature.title}
                                </h3>

                                <p className="text-sm leading-relaxed text-txt-secondary">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.article>
                    );
                })}
            </motion.div>

            <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-[0.2em] font-display text-txt-secondary">
                    Tarifs
                </h3>
                <div className="crystal-card p-4">
                    <div className="relative z-10 space-y-3">
                        <p className="text-sm text-txt-secondary">
                            Les produits peuvent etre achetes en <span className="text-txt-primary font-medium">1 day, 1 week, 1 month ou lifetime</span>,
                            selon ce qui est propose. Certaines cles 1 day commencent a 5 EUR.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {CRYSTAL_DURATIONS.map((duration) => (
                                <span
                                    key={duration}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs border border-white/12 bg-white/[0.02] text-txt-secondary"
                                >
                                    {duration}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {CRYSTAL_PRICING.map((pricing) => (
                        <motion.article key={pricing.title} variants={item} className="crystal-card p-5">
                            <div className="relative z-10 space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs uppercase tracking-[0.16em] text-txt-muted">{pricing.title}</p>
                                    {pricing.featured && (
                                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 text-txt-primary">
                                            Le plus choisi
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-display font-semibold text-txt-primary">{pricing.price}</p>
                                <p className="text-sm text-txt-secondary leading-relaxed">{pricing.description}</p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-[0.2em] font-display text-txt-secondary">
                    Catalogue
                </h3>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {CRYSTAL_CATALOG.map((itemData) => (
                        <motion.article key={itemData.title} variants={item} className="crystal-card p-5">
                            <div className="relative z-10 space-y-2">
                                <p className="text-xs uppercase tracking-[0.16em] text-txt-muted">{itemData.title}</p>
                                <p className="text-sm text-txt-secondary leading-relaxed">{itemData.description}</p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
                <p className="text-xs text-txt-muted">
                    Les offres de comptes/services doivent respecter les conditions d utilisation des plateformes concernees.
                </p>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-[0.2em] font-display text-txt-secondary">
                    Moyens de paiement acceptes
                </h3>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {PAYMENT_METHODS.map((method) => {
                        const iconData = ICONS[method.key];
                        return (
                            <motion.div key={method.name} variants={item}>
                                <PaymentCard
                                    icon={iconData?.icon}
                                    color={iconData?.color}
                                    name={method.name}
                                    value={method.value}
                                    copyValue={method.copyValue}
                                    link={method.link}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
