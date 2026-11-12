// Titre de section : un vrai h2, et une phrase d'introduction qui se place à côté sur grand écran.
export default function SectionHeading({ title, description, className = '' }) {
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 items-end mb-12 sm:mb-16 ${className}`}>
            <h2 className="type-h2 text-txt-primary lg:col-span-7">{title}</h2>
            {description && (
                <p className="prose-body lg:col-span-5 lg:pb-1">{description}</p>
            )}
        </div>
    );
}
