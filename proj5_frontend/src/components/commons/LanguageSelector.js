import { useState } from 'react';
import { userStore } from '../../stores/userStore';
import './LanguageSelector.css';

function LanguageSelector() {
  const { locale, updateLocale, loadTranslations } = userStore(); // Ações do store
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    pt: { name: 'PT', flag: '/flags/pt.png' },
    en: { name: 'EN', flag: '/flags/en.png' },
    fr: { name: 'FR', flag: '/flags/fr.png' },
  };

  const handleSelect = async (newLocale) => {
    try {
      // Carrega as traduções do novo idioma
      const translations = await import(`../../translations/${newLocale}.json`);
      updateLocale(newLocale);
      loadTranslations(translations.default); // Atualiza as traduções no store
    } catch (error) {
      console.error("Erro ao carregar traduções:", error);
      // Fallback para português se o arquivo não existir
      const fallback = await import('../../translations/pt.json');
      updateLocale('pt');
      loadTranslations(fallback.default);
    }
    setIsOpen(false);
  };

  return (
    <div className="language-dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        <img 
          src={languages[locale].flag} 
          alt={languages[locale].name} 
          className="dropdown-flag"
        />
        <span className="dropdown-label">{locale.toUpperCase()}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <div 
              key={code} 
              className={`dropdown-item ${code === locale ? 'selected' : ''}`}
              onClick={() => handleSelect(code)}
            >
              <img src={flag} alt={name} className="dropdown-item-flag" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;

