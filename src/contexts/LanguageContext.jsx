import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('language_preference') || null;
    });

    const setLanguage = (lang) => {
        localStorage.setItem('language_preference', lang);
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
