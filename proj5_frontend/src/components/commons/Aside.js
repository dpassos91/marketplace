import React from 'react';
import { Link } from 'react-router-dom';
import './Aside.css'; // Certifique-se de que o caminho está correto

function Aside() {
  return (
    <div className="aside-container">
      <div className="nav-pag">
        <Link to="/produtos">
          <button className="btn-produtos" type="button">
            <h2>Produtos</h2>
          </button>
        </Link>
      </div>
      <aside>
        <div className="sobre_nos">
          <h1>Sobre Nós</h1>
          <p>
            No Loop Market, promovemos a economia circular, reutilizando e reciclando recursos para minimizar o desperdício.
            Nossa plataforma conecta consumidores e empresas a produtos sustentáveis, prolongando o ciclo de vida dos materiais
            e reduzindo o impacto ambiental.
            <br /><br />
            Cada compra no Loop Market apoia um consumo mais consciente e ecológico. Junte-se a nós e contribua para um futuro mais verde e sustentável.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Aside;
