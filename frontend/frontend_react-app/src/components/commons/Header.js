import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenModal = () => {
    // Defina a lógica para abrir o modal aqui
    // ou importe a função de outro componente/hook
    console.log('Abrir modal'); // Apenas para teste
    navigate('/sell-product'); // Use navigate para redirecionar
  };

  return (
    <header id="header">
      <div className="logo">
        <Link to="/" title="Home">
          <h1>The Loop Market</h1>
        </Link>
      </div>

      <div className="bem-vindo" id="welcome-message">
        {/* Mensagem de boas-vindas com nome do user logado */}
      </div>
      <div className="img-perfil" id="profile-picture-container">
        <img src="" alt="Foto Perfil" id="profile-picture" />
      </div>

      <div className="admin-button" id="adminBtn">
        <Link to="/admin" title="Admin Dashboard">
          <i className="fa fa-lock" aria-hidden="true"></i> Painel de Administração
        </Link>
      </div>

      <nav className="navbar">
        {user ? (
          <>
            <div className="button" id="botao-logout">
              <button onClick={logout} title="Logout">
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </button>
            </div>
            <div className="button" id="openModalBtn">
              <button onClick={handleOpenModal} title="Vender um produto">
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="button" id="botao-login">
            <Link to="/login" title="Login">
              <i className="fa fa-user-o" aria-hidden="true"></i>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;



