import { useTranslation } from '../contexts/LanguageContext';

// Trois principes, chacun appuyé sur un exemple réel tiré du code de ce site.
export default function ApproachSection() {
    const { t } = useTranslation();
    const { title, principles } = t.approach;

    return (
        <div>
            <h2 className="type-h2 text-txt-primary mb-12 sm:mb-16 max-w-[16ch]">{title}</h2>

            <ol>
                {principles.map((principle) => (
                    <li
                        key={principle.title}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-3 py-8 sm:py-10 rule-top"
                    >
                        <h3 className="type-h3 text-txt-primary lg:col-span-5">{principle.title}</h3>
                        <p className="prose-body lg:col-span-7">{principle.text}</p>
                    </li>
                ))}
            </ol>
        </div>
    );
}
