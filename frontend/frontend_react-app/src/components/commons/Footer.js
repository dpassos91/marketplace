// src/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer id="footer">
      <div className="direitos_autor">
        <p>© 2025 | Todos os direitos reservados</p>
      </div>

      <div>
        <h4>Diogo | Projeto 4 | AOR - PAJ 2025</h4>
      </div>

      <div className="centro_atendimento">
        <h4>Centro de Atendimento</h4>
        <p>Atendimento: Seg-Sex, 08h - 18h</p>
        <p>Telefone: +351 || 239 123 456</p>
        <p>E-mail: 
          <a href="mailto:suporte@loop-market.com">suporte@loop-market.com</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
