import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const userStore = create(
  persist(
    (set) => ({
      // Estado inicial
      username: "",
      mediatype: {},
      locale: "pt", // Idioma padrão
      translations: {}, // Armazena as traduções carregadas
      
      // Ações
      updateName: (username) => set({ username }),
      updateMediatype: (mediatype) => set({ mediatype }),
      updateLocale: (locale) => set({ locale }),
      loadTranslations: (translations) => set({ translations }),

      // Detecção automática do idioma do navegador
      initializeLanguage: () => {
        const browserLanguage = navigator.language.slice(0, 2); // Exemplo: "pt", "en", "fr"
        const supportedLanguages = ['pt', 'en', 'fr'];
        const detectedLanguage = supportedLanguages.includes(browserLanguage)
          ? browserLanguage
          : 'pt'; // Fallback para português se o idioma não for suportado

        set({ locale: detectedLanguage }); // Define o idioma detectado no estado global
      }
    }),
    { 
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ locale: state.locale }) // Persiste apenas o idioma
    }
  )
);

