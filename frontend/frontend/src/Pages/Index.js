import React from 'react';
import { Link } from 'react-router-dom';
import Aside from '../Aside'; // Importe o componente Aside

function Index() {
  return (
    <main className="main-container">
      <Aside />
      <div className="main-card-container">
        <h1>Últimos produtos adicionados</h1>
        <section className="card-container recent-products"></section>
        <h1>Categorias disponíveis</h1>
        <section className="card-container categories-container"></section>
      </div>
    </main>
  );
}

export default Index;
