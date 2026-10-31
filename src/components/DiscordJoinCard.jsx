import { motion } from 'framer-motion';
import { FaDiscord, FaArrowRight } from 'react-icons/fa';
import { DISCORD_INVITE_CODE } from '../data/portfolioData';
import { useDiscordInvite } from '../hooks/useDiscordInvite';
import { useTranslation } from '../contexts/LanguageContext';

export default function DiscordJoinCard() {
    const { language } = useTranslation();
    const { members, online } = useDiscordInvite(DISCORD_INVITE_CODE);
    const fmt = (n) => n.toLocaleString(language === 'en' ? 'en-US' : 'fr-FR');

    return (
        <motion.a
            href={`https://discord.gg/${DISCORD_INVITE_CODE}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#5865F2]/40 bg-[#5865F2]/10 px-5 py-4 transition-colors hover:border-[#5865F2]/80 hover:bg-[#5865F2]/20 shadow-[0_0_30px_rgba(88,101,242,0.25)]"
        >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2] text-white shadow-[0_0_20px_rgba(88,101,242,0.6)]">
                <FaDiscord className="text-3xl" />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block font-display text-base sm:text-lg font-bold uppercase tracking-wider text-txt-primary">
                    {language === 'en' ? 'Join the Discord' : 'Rejoindre le Discord'}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-txt-secondary">
                    {online !== null && (
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
                            {fmt(online)} {language === 'en' ? 'online' : 'en ligne'}
                        </span>
                    )}
                    {members !== null && (
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-white/40" />
                            {fmt(members)} {language === 'en' ? 'members' : 'membres'}
                        </span>
                    )}
                    {members === null && online === null && (
                        <span>{language === 'en' ? 'Kronos Solution community' : 'Communauté Kronos Solution'}</span>
                    )}
                </span>
            </span>

            <FaArrowRight className="shrink-0 text-txt-secondary transition-transform group-hover:translate-x-1" />
        </motion.a>
    );
}
