import React from 'react';
import './Footer.css'; // Certifique-se de que o caminho está correto
import { FormattedMessage } from 'react-intl';

function Footer() {
  return (
    <footer id="footer">
      <div className="direitos_autor">
        <p><FormattedMessage id="footer.rights" defaultMessage="© 2025 | Todos os direitos reservados"/></p>
      </div>

      <div>
        <h4><FormattedMessage id="footer.author" defaultMessage="Diogo Passos | Projeto 5 | AOR - PAJ 2025"/></h4>
      </div>

      <div className="centro_atendimento">
        <h4><FormattedMessage id="footer.center" defaultMessage="Centro de Atendimento"/></h4>
        <p><FormattedMessage id="footer.service" defaultMessage="Seg-Sex, 08h - 18h"/></p>
        <p><FormattedMessage id="footer.phone" defaultMessage="Telefone: +351 || 239 123 456"/></p>
        <p>E-mail: 
          <a href="mailto:suporte@loop-market.com">suporte@loop-market.com</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
