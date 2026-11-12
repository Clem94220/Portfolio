import { GAME_ICONS, STAFF_SERVERS } from '../data/portfolioData';
import { useTranslation } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';

// « À côté du code » : jeux compétitifs et anciens rôles de staff, en listes plutôt qu'en cartes.
export default function SideSection() {
    const { t } = useTranslation();
    const side = t.side;

    return (
        <div>
            <SectionHeading title={side.title} description={side.intro} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-14">
                <div className="lg:col-span-7">
                    <h3 className="type-label mb-2">{side.gamesTitle}</h3>
                    <ul>
                        {side.games.map((game) => (
                            <li key={game.title} className="flex items-start gap-4 py-5 rule-top">
                                {GAME_ICONS[game.title] && (
                                    <img
                                        src={GAME_ICONS[game.title]}
                                        alt=""
                                        className="w-8 h-8 object-contain mt-0.5 shrink-0"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                )}
                                <div>
                                    <p className="text-lg font-semibold text-txt-primary leading-snug">{game.title}</p>
                                    <p className="text-txt-secondary mt-1">{game.detail}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-5">
                    <h3 className="type-label">{side.staffTitle}</h3>
                    <p className="text-sm text-txt-muted mt-1 mb-2">{side.staffNote}</p>
                    <ul>
                        {STAFF_SERVERS.map((server) => (
                            <li key={server.name} className="flex items-center gap-4 py-4 rule-top">
                                <img
                                    src={server.icon}
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className="text-lg font-semibold text-txt-primary flex-1">{server.name}</span>
                                <span className="type-data text-txt-muted">{side.pastStaffRole}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
