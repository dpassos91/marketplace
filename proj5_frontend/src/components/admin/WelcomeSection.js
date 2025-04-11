import React from 'react';
import { FormattedMessage } from 'react-intl';
import  './WelcomeSection.css';

function WelcomeSection() {
  return (
    <section id="welcome-section" className="welcome-section" style={{ textAlign: 'center' }}>
      <h1>
        <FormattedMessage id="admin.welcomeSection.title" defaultMessage="Bem-vindo ao Painel de Administração!" />
      </h1>
      <p>
        <FormattedMessage id="admin.welcomeSection.instruction" defaultMessage="Selecione uma opção no menu à esquerda para começar." />
      </p>
      <p>
        <FormattedMessage id="admin.welcomeSection.description" defaultMessage="Aqui poderá gerir avaliações, produtos e utilizadores do sistema." />
      </p>
    </section>
  );
}

export default WelcomeSection;


