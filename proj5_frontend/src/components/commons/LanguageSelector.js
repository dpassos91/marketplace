import { useState } from 'react';
import { userStore } from '../../stores/userStore'; // Importação do store de usuário
import './LanguageSelector.css'; // Importação do CSS

function LanguageSelector() {
  const locale = userStore((state) => state.locale);
  const updateLocale = userStore((state) => state.updateLocale);
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    pt: { name: 'PT', flag: '/flags/pt.png' },
    en: { name: 'EN', flag: '/flags/en.png' },
    fr: { name: 'FR', flag: '/flags/fr.png' },
  };

  const handleSelect = (newLocale) => {
    updateLocale(newLocale);
    setIsOpen(false); // Fecha o dropdown após a seleção
  };

  return (
    <div className="language-dropdown">
      {/* Botão para exibir o idioma atual */}
      <button 
        className="dropdown-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={languages[locale].flag} 
          alt={languages[locale].name} 
          className="dropdown-flag"
        />
        <span className="dropdown-label">{locale.toUpperCase()}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {/* Menu suspenso com as opções */}
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
