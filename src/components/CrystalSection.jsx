import { useState } from 'react';
import { m } from 'framer-motion';
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
    CRYSTAL_SCREENSHOTS,
    CRYSTAL_VOUCHES,
    DISCORD_DM_URL,
    DISCORD_TICKET_URL,
    PAYMENT_METHODS,
} from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import PaymentCard from './PaymentCard';
import ImageLightbox from './ImageLightbox';
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

    // Visionneuse : quel groupe d'images est ouvert et à quelle position
    const [lightbox, setLightbox] = useState({ group: null, index: null });
    const galleries = {
        shots: CRYSTAL_SCREENSHOTS.map((shot) => ({
            src: shot.src,
            alt: `Kronos loader - ${language === 'en' ? shot.en : shot.fr}`,
        })),
        vouches: CRYSTAL_VOUCHES.map((vouch, index) => ({
            src: vouch.src,
            alt: `${language === 'en' ? 'Customer vouch' : 'Avis client'} ${index + 1}`,
        })),
    };
    const openLightbox = (group, index) => setLightbox({ group, index });
    const closeLightbox = () => setLightbox({ group: null, index: null });

    return (
        <div className="space-y-10">
            <SectionHeading
                title="Kronos Solution"
                description={
                    language === 'en'
                        ? 'Custom software, gaming solutions, flexible pricing and accepted payment methods.'
                        : 'Logiciels privés, solutions gaming, tarifs flexibles et moyens de paiement acceptés.'
                }
            />

            {/* ── 1. Hero Showcase Card ── */}
            <m.div
                variants={item}
                initial={false}
                whileInView="show"
                viewport={{ once: true }}
                className="surface p-6 sm:p-8"
            >

                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
                            <div className="relative shrink-0">
                                <img
                                    src={CRYSTAL.icon}
                                    alt="Kronos Solution"
                                    className="w-16 h-16 rounded-2xl object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--green)] border-2 border-black" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="chip text-xs">
                                        Studio &amp; Shop
                                    </span>
                                    <span className="chip text-xs !text-[var(--green)] !border-[var(--green)]/40">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" aria-hidden="true" />
                                        Undetected
                                    </span>
                                </div>
                                <p className="text-txt-secondary mt-3 max-w-xl [overflow-wrap:anywhere]">
                                    {t.crystal?.description || CRYSTAL.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <m.a
                                href={CRYSTAL.shopUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <FaShoppingBag aria-hidden="true" className="text-sm" />
                                {t.crystal?.shopBtn || 'Boutique'}
                            </m.a>
                            <m.a
                                href={CRYSTAL.discordUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost"
                            >
                                <FaDiscord aria-hidden="true" className="text-base text-[#5865f2]" />
                                Discord
                            </m.a>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* ── Aperçu du loader ── */}
            <div className="space-y-4">
                <h3 className="type-h3 text-txt-primary">
                    {language === 'en' ? 'Loader preview' : 'Aperçu du loader'}
                </h3>
                <m.div
                    variants={container}
                    initial={false}
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {CRYSTAL_SCREENSHOTS.map((shot, index) => {
                        const caption = language === 'en' ? shot.en : shot.fr;
                        return (
                            <m.button
                                type="button"
                                key={shot.src}
                                variants={item}
                                onClick={() => openLightbox('shots', index)}
                                className="surface overflow-hidden group block w-full text-left cursor-zoom-in transition-colors hover:border-[var(--border-highlight)]"
                            >
                                <img
                                    src={shot.src}
                                    alt={`Kronos loader - ${caption}`}
                                    className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <p className="px-4 py-3 text-sm text-txt-secondary">{caption}</p>
                            </m.button>
                        );
                    })}
                </m.div>
            </div>

            <ImageLightbox
                images={lightbox.group ? galleries[lightbox.group] : []}
                index={lightbox.index}
                onClose={closeLightbox}
                onChange={(index) => setLightbox((state) => ({ ...state, index }))}
            />

            {/* ── Avis clients ── */}
            <div className="space-y-4">
                <h3 className="type-h3 text-txt-primary">
                    {language === 'en' ? 'Customer vouches' : 'Avis clients'}
                </h3>
                <p className="text-txt-muted max-w-2xl -mt-1">
                    {language === 'en'
                        ? 'Real vouches posted by customers in the Discord. Click an image to enlarge it.'
                        : 'De vrais avis postés par les clients sur le Discord. Clique sur une image pour l’agrandir.'}
                </p>
                <m.div
                    variants={container}
                    initial={false}
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                    {CRYSTAL_VOUCHES.map((vouch, index) => (
                        <m.button
                            type="button"
                            key={vouch.src}
                            variants={item}
                            onClick={() => openLightbox('vouches', index)}
                            className="surface overflow-hidden block w-full cursor-zoom-in transition-colors hover:border-[var(--border-highlight)]"
                        >
                            <img
                                src={vouch.src}
                                alt={`${language === 'en' ? 'Customer vouch' : 'Avis client'} ${index + 1}`}
                                className="w-full aspect-[4/5] object-cover object-top"
                                loading="lazy"
                                decoding="async"
                            />
                        </m.button>
                    ))}
                </m.div>
            </div>

            {/* ── 2. Offres & Produits Disponibles (Cartes Sombres / Néon) ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="type-h3 text-txt-primary">
                        {t.common?.catalog || 'Nos Offres & Produits'}
                    </h3>
                </div>

                <m.div
                    variants={container}
                    initial={false}
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                >
                    {offersList.map((offer) => {
                        const Icon = OFFER_ICONS[offer.id] || FaShieldAlt;
                        return (
                            <m.article
                                key={offer.id || offer.title}
                                variants={item}
                                className="surface p-6 flex flex-col justify-between transition-colors hover:border-[var(--border-highlight)]"
                            >

                                <div className="relative z-10 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                                                style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                                            >
                                                <Icon aria-hidden="true" className="text-lg text-txt-primary" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-txt-primary leading-snug">
                                                {offer.title}
                                            </h4>
                                        </div>

                                        {offer.badge && (
                                            <span
                                                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    borderColor: offer.badgeColor ? `${offer.badgeColor}40` : 'rgba(255,255,255,0.2)',
                                                    color: offer.badgeColor || 'var(--accent)',
                                                }}
                                            >
                                                {offer.badge}
                                            </span>
                                        )}
                                    </div>

                                    <p className="leading-relaxed text-txt-secondary">
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
                            </m.article>
                        );
                    })}
                </m.div>
            </div>

            {/* ── 3. Tarification Flexible & Formules ── */}
            <m.div
                variants={item}
                initial={false}
                whileInView="show"
                viewport={{ once: true }}
                className="surface p-6 sm:p-7"
            >
                <div className="relative z-10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                                                <h3 className="text-xl font-semibold text-txt-primary">
                                    {t.crystal?.pricingTitle || 'Tarification Flexible'}
                                </h3>
                            </div>
                            <p className="text-txt-secondary max-w-2xl leading-relaxed mt-1">
                                {t.crystal?.pricingDescription ||
                                    'Les prix sont flexibles et s adaptent à votre demande, aux options choisies et au type de produit.'}
                            </p>
                        </div>

                        <span className="self-start sm:self-auto text-sm text-txt-primary sm:max-w-[22rem] sm:text-right">
                            {t.crystal?.pricingStarting || 'Clés disponibles dès 5€'}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="type-label">
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
            </m.div>

            {/* ── Une question ? ── */}
            <div className="surface p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-txt-primary">
                        {language === 'en' ? 'Got a question?' : 'Une question ?'}
                    </h3>
                    <p className="text-txt-secondary max-w-xl leading-relaxed">
                        {language === 'en'
                            ? 'Send me a DM on Discord or open a ticket in the server, I answer as soon as I can.'
                            : 'Envoie-moi un DM sur Discord ou ouvre un ticket sur le serveur, je réponds dès que possible.'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={DISCORD_DM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        <FaDiscord aria-hidden="true" className="text-base" />
                        {language === 'en' ? 'DM me' : 'Me DM'}
                    </a>
                    <a
                        href={DISCORD_TICKET_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                    >
                        {language === 'en' ? 'Open a ticket' : 'Ouvrir un ticket'}
                    </a>
                </div>
            </div>

            {/* ── 4. Moyens de Paiement (Séparation Distincte PayPal & Cryptos) ── */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <h3 className="type-h3 text-txt-primary">
                        {t.common?.acceptedPayments || 'Moyens de paiement acceptés'}
                    </h3>
                </div>

                {/* PayPal Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FaPaypal aria-hidden="true" className="text-sm text-[#0079C1]" />
                        <h4 className="type-label">
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
                        <FaCoins aria-hidden="true" className="text-sm text-[#F7931A]" />
                        <h4 className="type-label">
                            {t.common?.cryptoPayments || 'Cryptomonnaies'} (BTC, ETH, LTC)
                        </h4>
                    </div>

                    <m.div
                        variants={container}
                        initial={false}
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {PAYMENT_METHODS.crypto.map((method) => {
                            const iconData = CRYPTO_ICONS[method.key];
                            return (
                                <m.div key={method.name} variants={item}>
                                    <PaymentCard
                                        icon={iconData?.icon}
                                        color={iconData?.color}
                                        name={method.name}
                                        value={method.value}
                                        copyValue={method.copyValue}
                                        link={method.link}
                                    />
                                </m.div>
                            );
                        })}
                    </m.div>
                </div>
            </div>
        </div>
    );
}
