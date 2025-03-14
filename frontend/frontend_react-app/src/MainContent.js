// src/MainContent.js
import React from 'react';

function MainContent() {
  return (
    <div className="main-card-container">
      <h1>Últimos produtos adicionados</h1>
      <section className="card-container recent-products"></section>
      <h1>Categorias disponíveis</h1>
      <section className="card-container categories-container"></section>
    </div>
  );
}

export default MainContent;
