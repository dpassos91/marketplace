import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useAuth } from '../../hooks/UseAuth';

function Header() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate('/sell-product');
  };

  return (
    <header id="header">
      <div className="logo">
        <Link to="/" title="Home">
          <h1>The Loop Market</h1>
        </Link>
      </div>

      <div className="bem-vindo" id="welcome-message">
        {user ? `Bem-vindo, ${user.firstName}!` : 'Bem-vindo ao The Loop Market!'}
      </div>

      <div className="img-perfil" id="profile-picture-container">
        {user ? (
          <img
            src={user.profilePicture || '/path/to/default/image.jpg'}
            alt={user.firstName ? `Foto de perfil de ${user.firstName}` : 'Foto de perfil'}
            id="profile-picture"
          />
        ) : (
          <img src="/path/to/default/image.jpg" alt="Foto de perfil padrão" id="profile-picture" />
        )}
      </div>

      <nav className="navbar">
  {user !== null ? (
    <>
      <div className="button" id="botao-logout">
        <button onClick={logout} title="Logout">
          Logout
        </button>
      </div>
      <div className="button" id="openModalBtn">
        <button onClick={handleOpenModal} title="Vender um produto">
          Vender
        </button>
      </div>
    </>
  ) : (
    <div className="button" id="botao-login">
      <Link to="/login" title="Login">
        Login
      </Link>
    </div>
  )}
</nav>
    </header>
  );
}

export default Header;




