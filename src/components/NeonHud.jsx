import { m } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';

export default function NeonHud({ totalViews, activeNow }) {
    const { t, language } = useTranslation();
    return (
        <m.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.45 }}
            className="hidden sm:block fixed bottom-4 right-4 z-50 p-2 min-w-[110px] rounded-lg backdrop-blur-md border border-white/10 pointer-events-none"
            style={{ background: 'rgba(8,10,14,0.52)' }}
            aria-hidden
        >
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                    <span className="text-[11px] font-medium text-txt-muted">{t.common.live}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-txt-muted">{t.ui.views}</span>
                    <span className="text-[11px] font-mono text-txt-secondary tabular-nums">
                        {(totalViews ?? 0).toLocaleString(language === 'en' ? 'en-US' : 'fr-FR')}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-txt-muted">{t.ui.active}</span>
                    <span className="text-[11px] font-mono text-txt-secondary tabular-nums">{activeNow}</span>
                </div>
            </div>
        </m.aside>
    );
}
