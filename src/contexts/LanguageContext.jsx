import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();
const STORAGE_KEY = 'language_preference';

// Pas de fenêtre bloquante : on lit la préférence enregistrée, sinon la langue du navigateur.
function detectLanguage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'fr' || saved === 'en') return saved;
    } catch {
        // stockage bloqué (navigation privée) : on retombe sur la langue du navigateur
    }
    const browser = (typeof navigator !== 'undefined' && navigator.language) || 'fr';
    return browser.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(detectLanguage);

    const setLanguage = (lang) => {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // préférence non mémorisée, le site fonctionne quand même
        }
        setLanguageState(lang);
    };

    const t = translations[language];

    // Langue, titre d'onglet et description suivent la langue choisie.
    useEffect(() => {
        document.documentElement.lang = language;
        document.title = t.meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    }, [language, t]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    return useContext(LanguageContext);
}
