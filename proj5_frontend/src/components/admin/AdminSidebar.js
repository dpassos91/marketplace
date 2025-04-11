import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>
        <FormattedMessage id="admin.sidebar.title" defaultMessage="Painel de Administração" />
      </h2>
      <nav>
        <ul>
          <li>
            <Link to="/admin/dashboard" className="btn-produtos" id="dashboard">
              <FormattedMessage id="admin.sidebar.dashboard" defaultMessage="Dashboard" />
            </Link>
          </li>
          <li>
            <Link to="/admin/avaliacoes" className="btn-produtos" id="gestao-avaliacoes">
              <FormattedMessage id="admin.sidebar.avaliacoes" defaultMessage="Gestão de Avaliações" />
            </Link>
          </li>
          <li>
            <Link to="/admin/produtos" className="btn-produtos" id="gestao-produtos">
              <FormattedMessage id="admin.sidebar.produtos" defaultMessage="Gestão de Produtos" />
            </Link>
          </li>
          <li>
            <Link to="/admin/utilizadores" className="btn-produtos" id="gestao-utilizadores">
              <FormattedMessage id="admin.sidebar.utilizadores" defaultMessage="Gestão de Utilizadores" />
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;


