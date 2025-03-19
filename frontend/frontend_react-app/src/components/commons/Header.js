import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useAuth } from '../../hooks/UseAuth';

function Header() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    console.log('URL da imagem do usuário:', user?.picture);
  }, [user]);

  const handleOpenModal = () => {
    navigate('/sell-product');
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`); // Certifique-se de que esta rota está definida no seu router
  };

  return (
    <header id="header">
      <div className="logo">
        <Link to="/" title="Home">
          <h1>The Loop Market</h1>
        </Link>
      </div>

      <div className="bem-vindo" id="welcome-message">
        {user && `Bem-vindo, ${user.firstName}!`}
      </div>

      {user ? (
        <div className="img-perfil" id="profile-picture-container" onClick={handleProfileClick}>
          <img
            src={user.picture || '/path/to/default/image.jpg'}
            alt={user.firstName ? `Foto de perfil de ${user.firstName}` : 'Erro ao carregar a imagem'}
            id="profile-picture"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/path/to/default/image.jpg';
            }}
            style={{cursor: 'pointer'}} // Adiciona um cursor de ponteiro para indicar que é clicável
          />
        </div>
      ) : null}

      <nav className="navbar">
        {user ? (
          <>
            <div className="button" id="botao-logout">
              <button onClick={() => logout()} title="Logout" className="btn btn-outline-danger">
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </button>
            </div>
            <div className="button" id="openModalBtn">
              <button onClick={handleOpenModal} title="Vender um produto" className="btn btn-outline-success">
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="button" id="botao-login">
            <Link to="/login" title="Login" className="btn btn-outline-primary">
              <i className="fa fa-user" aria-hidden="true"></i>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
