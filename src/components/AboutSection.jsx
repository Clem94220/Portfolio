import { useTranslation } from '../contexts/LanguageContext';

export default function AboutSection() {
    const { t } = useTranslation();
    const { title, text, timeline } = t.about;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
            <div className="lg:col-span-5">
                <h2 className="type-h2 text-txt-primary">{title}</h2>
                <p className="prose-body mt-6">{text}</p>
            </div>

            <ol className="lg:col-span-7 lg:pt-2">
                {timeline.map((item) => (
                    <li
                        key={item.period + item.title}
                        className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-8 gap-y-1 py-6 rule-top"
                    >
                        <p className="type-data text-txt-muted pt-1">{item.period}</p>
                        <div>
                            <h3 className="text-lg font-semibold text-txt-primary leading-snug">{item.title}</h3>
                            <p className="text-txt-secondary mt-1.5 max-w-measure">{item.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
