import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import ptTranslations from '../translations/pt.json';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

const languageFiles = {
    pt: ptTranslations,
    en: enTranslations,
    fr: frTranslations,
};

export const userStore = create(
    persist(
        (set, get) => ({
            // Estado inicial
            username: "",
            mediatype: {},
            locale: "pt", // Idioma padrão
            translations: languageFiles.pt, // Carrega as traduções padrão

            // Ações
            updateName: (username) => set({ username }),
            updateMediatype: (mediatype) => set({ mediatype }),
            updateLocale: (locale) => set({ locale }),
            loadTranslations: (translations) => set({ translations }),

            // Detecção automática do idioma do navegador
            initializeLanguage: () => {
                console.log("Iniciando initializeLanguage");
                const browserLanguage = navigator.language.slice(0, 2); // Exemplo: "pt", "en", "fr"
                console.log("Idioma do navegador:", browserLanguage);
                const supportedLanguages = ['pt', 'en', 'fr'];
                const initialLanguage = supportedLanguages.includes(browserLanguage)
                    ? browserLanguage
                    : 'pt'; // Fallback para português se o idioma não for suportado
                console.log("Idioma inicial:", initialLanguage);

                set({
                    locale: initialLanguage,
                    translations: languageFiles[initialLanguage] || languageFiles.pt
                });
            }
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ locale: state.locale, translations: state.translations })
        }
    )
);



