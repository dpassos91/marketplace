// src/Header.js
import React from 'react';

function Header() {
  return (
    <header id="header">
      <div className="logo">
        <a href="index.html" title="Home">
          <h1>The Loop Market</h1>
        </a>
      </div>

      <div className="bem-vindo" id="welcome-message">
        {/* Mensagem de boas-vindas com nome do user logado */}
      </div>
      <div className="img-perfil" id="profile-picture-container">
        <img src="" alt="Foto Perfil" id="profile-picture" />
      </div>

      <div className="admin-button" id="adminBtn">
        <a href="#" title="Admin Dashboard">
          <i className="fa fa-lock" aria-hidden="true"></i> Painel de Administração
        </a>
      </div>

      <nav className="navbar">
        <div className="button" id="botao-login">
          <a href="pagina-login.html" title="Login">
            <i className="fa fa-user-o" aria-hidden="true"></i>
          </a>
        </div>
        <div className="button" id="botao-logout">
          <a href="#" title="Logout">
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </a>
        </div>
        <div className="button" id="openModalBtn">
          <a href="#" title="Vender um produto">
            <i className="fa fa-plus" aria-hidden="true"></i>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
