import React from 'react';
import { Link } from 'react-router-dom';
import './Aside.css';
import { FormattedMessage } from 'react-intl';
import { deviceStore } from '../../stores/deviceStore';
import useMediaType from '../../hooks/useMediaType';


function Aside() {
  useMediaType();
  const { mediaType } = deviceStore();

  return (
    <div className={`aside-container ${mediaType.isTabletOrMobile ? 'aside-mobile' : ''}`}>
      
      <div className="nav-pag">

        <Link to="/produtos">
          <button className="btn-produtos" type="button">
            <h2><FormattedMessage id="aside.products" defaultMessage="Produtos" /></h2>
          </button>
        </Link>
      </div>

      <aside>
        <div className="sobre_nos">
          <h1><FormattedMessage id="aside.aboutUs" defaultMessage="Sobre Nós" /></h1>
          <p>
            <FormattedMessage
              id="aside.description"
              defaultMessage="No Loop Market, promovemos a economia circular, reutilizando e reciclando recursos para minimizar o desperdício.
              Nossa plataforma conecta consumidores e empresas a produtos sustentáveis, prolongando o ciclo de vida dos materiais
              e reduzindo o impacto ambiental."
            />
            <br /><br />
            <FormattedMessage
              id="aside.callToAction"
              defaultMessage="Cada compra no Loop Market apoia um consumo mais consciente e ecológico. Junte-se a nós e contribua para um futuro mais verde e sustentável."
            />
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Aside;
