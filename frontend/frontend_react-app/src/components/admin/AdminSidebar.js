import React from 'react';

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Painel de Administração</h2>
      <nav>
        <ul>
          <li><a href="#" className="btn-produtos" id="gestao-avaliacoes">Gestão de Avaliações</a></li>
          <li><a href="#" className="btn-produtos" id="gestao-produtos">Gestão de Produtos</a></li>
          <li><a href="#" className="btn-produtos" id="gestao-utilizadores">Gestão de Utilizadores</a></li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
