// src/Aside.js
import React from 'react';

function Aside() {
  return (
    <div className="aside-container">
      <div className="nav-pag">
        <a href="produto-total.html">
          <button className="btn-produtos" type="button">
            <h2>Produtos</h2>
          </button>
        </a>
      </div>
      <aside>
        <br />
        <br />
        <div className="sobre_nos">
          <h1>Sobre Nós</h1>
          <p className="sobre_nos">
            No Loop Market, promovemos a economia circular, reutilizando e reciclando recursos para minimizar o desperdício.
            Nossa plataforma conecta consumidores e empresas a produtos sustentáveis, prolongando o ciclo de vida dos materiais
            e reduzindo o impacto ambiental.
            Cada compra no Loop Market apoia um consumo mais consciente e ecológico. Junte-se a nós e contribua para um futuro mais verde e sustentável.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Aside;
