import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Painel de Administração</h2>
      <nav>
        <ul>
          <li>
            <Link to="/admin/avaliacoes" className="btn-produtos" id="gestao-avaliacoes">
              Gestão de Avaliações
            </Link>
          </li>
          <li>
            <Link to="/admin/produtos" className="btn-produtos" id="gestao-produtos">
              Gestão de Produtos
            </Link>
          </li>
          <li>
            <Link to="/admin/utilizadores" className="btn-produtos" id="gestao-utilizadores">
              Gestão de Utilizadores
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;

