export default function SectionHeading({ title, description }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="section-heading-bar" />
                <h2 className="text-sm uppercase tracking-[0.22em] font-display text-txt-secondary">{title}</h2>
            </div>
            {description && <p className="text-sm sm:text-base text-txt-muted max-w-2xl">{description}</p>}
        </div>
    );
}
