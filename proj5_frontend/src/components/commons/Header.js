import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';
import AddProductModal from '.././product/AddProductModal';
import './Header.css'; // Certifique-se de que o caminho está correto

function Header() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    console.log('URL da imagem do usuário:', user?.picture);

    // Verifica se existe o userData no localStorage e se o utilizador é admin
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.admin) {
      setAdmin(true);
    }
  }, [user?.picture, user?.admin]); // Depende apenas das propriedades específicas do objeto user

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true); // Abre o modal em vez de navegar
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false); // Fecha o modal
  }, []);

  const handleProfileClick = useCallback(() => {
    navigate(`/profile/${user?.id}`); // Certifique-se de que esta rota está definida no seu router
  }, [navigate, user?.id]);

  const profilePicture = useMemo(() => {
    return user?.picture || '/path/to/default/image.jpg';
  }, [user?.picture]);

  return (
    <>
      <header id="header">
        <div className="logo">
          <Link to="/" title="Home">
            <h1>The Loop Market</h1>
          </Link>
        </div>

        <div className="bem-vindo" id="welcome-message">
          {user && `Bem-vindo, ${user.name}!`}
        </div>

        {user ? (
          <div className="img-perfil" id="profile-picture-container" onClick={handleProfileClick}>
            <img
              src={profilePicture}
              alt={user.name ? `Foto de perfil de ${user.name}` : 'Erro ao carregar a imagem'}
              id="profile-picture"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/default/image.jpg';
              }}
              style={{ cursor: 'pointer' }} // Adiciona um cursor de ponteiro para indicar que é clicável
            />
          </div>
        ) : null}

        <nav className="navbar">
          {user ? (
            <>
              {/* Botão de logout */}
              <div className="button" id="botao-logout">
                <button onClick={() => logout()} title="Logout" className="btn btn-outline-danger">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </button>
              </div>
              
              {/* Botão para adicionar produto */}
              <div className="button" id="openModalBtn">
                <button onClick={handleOpenModal} title="Adicionar um produto" className="btn btn-outline-success">
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              </div>

              {/* Botão de "Área de administração", visível apenas para admins */}
              {admin && (
                <div className="button" id="admin-area-btn" style={{ marginLeft: '65px' }}>
                  <Link to="/admin" title="Área de administração" className="btn btn-outline-warning">
                    <i className="fa fa-cogs" aria-hidden="true"></i> Área de administração
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


