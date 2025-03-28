import React from 'react';

function WelcomeSection() {
  return (
    <section id="welcome-section" className="welcome-section" style={{ textAlign: 'center' }}>
      <h1>Bem-vindo ao Painel de Administração!</h1>
      <p style={{ marginTop: '20px' }}>Selecione uma opção no menu à esquerda para começar.</p>
      <p style={{ marginTop: '20px' }}>Aqui poderá gerir avaliações, produtos e utilizadores do sistema.</p>
    </section>
  );
}

export default WelcomeSection;

