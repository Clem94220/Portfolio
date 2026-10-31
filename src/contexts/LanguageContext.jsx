import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // localStorage peut être bloqué (navigation privée, cookies désactivés) : ne jamais planter
    const [language, setLanguageState] = useState(() => {
        try {
            return localStorage.getItem('language_preference') || null;
        } catch {
            return null;
        }
    });

    const setLanguage = (lang) => {
        try {
            localStorage.setItem('language_preference', lang);
        } catch {
            // préférence non mémorisée, le site fonctionne quand même
        }
        setLanguageState(lang);
    };

    // If language is not set yet, fallback to 'fr' for static lookups during the prompt
    const activeLanguage = language || 'fr';
    const t = translations[activeLanguage];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    return useContext(LanguageContext);
}
