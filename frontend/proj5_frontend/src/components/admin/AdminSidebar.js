import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminSidebar.module.css'; // Importação atualizada

function AdminSidebar() {
  return (
    <aside className={styles['admin-sidebar']}>
      <h2>Painel de Administração</h2>
      <nav>
        <ul>
          <li>
            <Link 
              to="/admin/avaliacoes" 
              className={styles['btn-produtos']} 
              id="gestao-avaliacoes"
            >
              Gestão de Avaliações
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/produtos" 
              className={styles['btn-produtos']} 
              id="gestao-produtos"
            >
              Gestão de Produtos
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/utilizadores" 
              className={styles['btn-produtos']} 
              id="gestao-utilizadores"
            >
              Gestão de Utilizadores
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;


