import { motion } from 'framer-motion';
import {
    FaDiscord,
    FaShoppingBag,
    FaShieldAlt,
    FaCoins,
    FaPaypal,
    FaCrosshairs,
    FaLaptopCode,
    FaUserShield,
    FaRocket,
} from 'react-icons/fa';
import { SiBitcoin, SiEthereum, SiLitecoin, SiPaypal } from 'react-icons/si';
import {
    CRYSTAL,
    CRYSTAL_DURATIONS,
    CRYSTAL_OFFERS,
    PAYMENT_METHODS,
} from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import PaymentCard from './PaymentCard';
import SectionHeading from './SectionHeading';

const CRYPTO_ICONS = {
    btc: { icon: SiBitcoin, color: '#F7931A' },
    eth: { icon: SiEthereum, color: '#627EEA' },
    ltc: { icon: SiLitecoin, color: '#345D9D' },
};

const PAYPAL_ICON = { icon: SiPaypal, color: '#0079C1' };

const OFFER_ICONS = {
    spoofers: FaCrosshairs,
    software: FaLaptopCode,
    accounts: FaUserShield,
    services: FaRocket,
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function CrystalSection() {
    const { t, language } = useTranslation();

    const durations = language === 'en'
        ? ['1 Day', '1 Week', '1 Month', 'Lifetime']
        : ['1 Jour', '1 Semaine', '1 Mois', 'À Vie'];

    const offersList = t.crystal?.offers || CRYSTAL_OFFERS;

    return (
        <div className="space-y-10">
            <SectionHeading
                title="Crystal Solution"
                description={
                    language === 'en'
                        ? 'Custom software, gaming solutions, flexible pricing and accepted payment methods.'
                        : 'Logiciels privés, solutions gaming, tarifs flexibles et moyens de paiement acceptés.'
                }
            />

            {/* ── 1. Hero Showcase Card ── */}
            <motion.div
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="crystal-card p-6 sm:p-8 relative overflow-hidden"
                style={{
                    boxShadow: '0 0 50px rgba(0, 240, 255, 0.03), 0 4px 30px rgba(0, 0, 0, 0.6)',
                }}
            >
                <div
                    className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
                    style={{ background: 'radial-gradient(circle, #00f0ff, transparent)' }}
                />

                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={CRYSTAL.icon}
                                    alt="Crystal Solution"
                                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--green)] border-2 border-black" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-txt-primary">
                                        {CRYSTAL.title}
                                    </h3>
                                    <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest rounded border border-white/20 text-txt-secondary">
                                        Studio &amp; Shop
                                    </span>
                                </div>
                                <p className="text-sm text-txt-secondary mt-1 max-w-xl">
                                    {t.crystal?.description || CRYSTAL.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.a
                                href={CRYSTAL.shopUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2.5 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-bold font-display uppercase tracking-wider hover:brightness-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                <FaShoppingBag className="text-sm" />
                                {t.crystal?.shopBtn || 'Boutique'}
                            </motion.a>
                            <motion.a
                                href={CRYSTAL.discordUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-txt-secondary hover:text-txt-primary hover:border-white/40 transition-colors bg-white/[0.02]"
                            >
                                <FaDiscord className="text-base text-[#5865f2]" />
                                Discord
                            </motion.a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── 2. Offres & Produits Disponibles (Cartes Sombres / Néon) ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-[0.25em] font-display text-txt-secondary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        {t.common?.catalog || 'Nos Offres & Produits'}
                    </h3>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                >
                    {offersList.map((offer) => {
                        const Icon = OFFER_ICONS[offer.id] || FaShieldAlt;
                        return (
                            <motion.article
                                key={offer.id || offer.title}
                                variants={item}
                                whileHover={{ y: -4, scale: 1.01 }}
                                className="crystal-card p-6 relative overflow-hidden group border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                    style={{ background: offer.badgeColor || '#00f0ff' }}
                                />

                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                                                style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                                            >
                                                <Icon className="text-lg text-txt-primary" />
                                            </div>
                                            <h4 className="text-base font-bold font-display text-txt-primary">
                                                {offer.title}
                                            </h4>
                                        </div>

                                        {offer.badge && (
                                            <span
                                                className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    borderColor: offer.badgeColor ? `${offer.badgeColor}40` : 'rgba(255,255,255,0.2)',
                                                    color: offer.badgeColor || 'var(--accent)',
                                                    boxShadow: offer.badgeColor ? `0 0 10px ${offer.badgeColor}22` : 'none',
                                                }}
                                            >
                                                {offer.badge}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm leading-relaxed text-txt-secondary">
                                        {offer.description}
                                    </p>

                                    {offer.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {offer.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border border-white/10 bg-white/[0.02] text-txt-muted"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </div>

            {/* ── 3. Tarification Flexible & Formules ── */}
            <motion.div
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="crystal-card p-6 sm:p-7 relative overflow-hidden border border-white/10"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)',
                }}
            >
                <div className="relative z-10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                                <h3 className="text-sm font-bold font-display uppercase tracking-widest text-txt-primary">
                                    {t.crystal?.pricingTitle || 'Tarification Flexible'}
                                </h3>
                            </div>
                            <p className="text-sm text-txt-secondary max-w-2xl leading-relaxed">
                                {t.crystal?.pricingDescription ||
                                    'Les prix sont flexibles et s adaptent à votre demande, aux options choisies et au type de produit.'}
                            </p>
                        </div>

                        <span className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-mono text-txt-primary whitespace-nowrap">
                            {t.crystal?.pricingStarting || 'Clés disponibles dès 5€'}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-xs uppercase font-mono text-txt-muted tracking-wider">
                            {language === 'en' ? 'Available Durations :' : 'Durées & Formules :'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {durations.map((duration) => (
                                <span
                                    key={duration}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium border border-white/15 bg-white/[0.03] text-txt-primary hover:border-white/35 transition-colors"
                                >
                                    {duration}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── 4. Moyens de Paiement (Séparation Distincte PayPal & Cryptos) ── */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <h3 className="text-xs uppercase tracking-[0.25em] font-display text-txt-secondary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                        {t.common?.acceptedPayments || 'Moyens de paiement acceptés'}
                    </h3>
                </div>

                {/* PayPal Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FaPaypal className="text-sm text-[#0079C1]" />
                        <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-txt-muted">
                            {t.common?.paypalPayments || 'PayPal'}
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PAYMENT_METHODS.paypal.map((method) => (
                            <PaymentCard
                                key={method.name}
                                icon={PAYPAL_ICON.icon}
                                color={PAYPAL_ICON.color}
                                name={method.name}
                                value={method.value}
                                copyValue={method.copyValue}
                                link={method.link}
                            />
                        ))}
                    </div>
                </div>

                {/* Cryptomonnaies Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FaCoins className="text-sm text-[#F7931A]" />
                        <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-txt-muted">
                            {t.common?.cryptoPayments || 'Cryptomonnaies'} (BTC, ETH, LTC)
                        </h4>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {PAYMENT_METHODS.crypto.map((method) => {
                            const iconData = CRYPTO_ICONS[method.key];
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
        </div>
    );
}
