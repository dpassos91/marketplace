import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';
import AddProductModal from '../product/AddProductModal';
import LanguageSelector from './LanguageSelector';
import { FormattedMessage } from 'react-intl';
import useMediaType from '../../hooks/useMediaType'; // Importa o hook
import { deviceStore } from '../../stores/deviceStore'; // Acede ao estado
import './Header.css';

function Header() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ⚙️ Ativa o hook para atualizar deviceStore
  useMediaType();
  const mediaType = deviceStore((state) => state.mediaType);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleProfileClick = useCallback(() => {
    navigate(`/perfil/${user?.id}`);
  }, [navigate, user?.id]);

  const profilePicture = useMemo(() => {
    return user?.picture || '/path/to/default/image.jpg';
  }, [user?.picture]);

  return (
    <>
      <header
        id="header"
        className={`
          ${mediaType.isTabletOrMobile ? 'header-mobile' : ''}
          ${mediaType.isPortrait ? 'header-portrait' : ''}
        `}
      >
        <div className="logo">
          <Link to="/" title="Home">
            <h1>The Loop Market</h1>
          </Link>
        </div>

        {user && (
          <div className="bem-vindo" id="welcome-message">
            <FormattedMessage
              id="header.welcome"
              defaultMessage="Bem-vindo, {name}!"
              values={{ name: user.name }}
            />
          </div>
        )}

        <div className={`language-selector-container ${user ? 'with-user' : 'no-user'}`}>
          <LanguageSelector />
        </div>

        {user && (
          <div className="img-perfil" id="profile-picture-container" onClick={handleProfileClick}>
            <img
              src={profilePicture}
              alt={user.name ? `Foto de perfil de ${user.name}` : 'Erro ao carregar a imagem'}
              id="profile-picture"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/default/image.jpg';
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}

        <nav className="navbar">
          {user ? (
            <>
              <div className="button" id="botao-logout">
                <button onClick={logout} title="Logout" className="btn btn-outline-danger">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </button>
              </div>

              <div className="button" id="openModalBtn">
                <button onClick={handleOpenModal} title="Adicionar um produto" className="btn btn-outline-success">
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              </div>

              {user?.admin && (
                <div className="button" id="admin-area-btn" style={{ marginLeft: '65px' }}>
                  <Link to="/admin" title="Área de administração" className="btn btn-outline-warning">
                    <i className="fa fa-cogs" aria-hidden="true"></i>{' '}
                    <FormattedMessage id="header.adminArea" defaultMessage="Área de administração" />
                  </Link>
                </div>
              )}
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

      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default Header;




