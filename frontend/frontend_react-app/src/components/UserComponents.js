import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { ProductCard } from './ProductCard'; // Certifique-se de que este caminho está correto
import * as productComponent from '../components/ProductComponent'; // Ajuste conforme necessário

function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await userAPI.loginUser(credentials);
      login(userData);
      alert(`Login bem sucedido! Bem-vindo/a ${userData.firstName} ${userData.lastName}!`);
      navigate('/');
    } catch (error) {
      alert('Login falhou! Por favor verifique as suas credenciais.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

function UserProfile() {
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { id: profileUserId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      let fetchedUser;
      if (profileUserId) {
        fetchedUser = await userAPI.getUserById(profileUserId);
        setIsOwnProfile(currentUser && String(currentUser.id) === String(profileUserId));
      } else if (currentUser) {
        fetchedUser = await userAPI.getUserById(currentUser.id);
        setIsOwnProfile(true);
      } else {
        navigate('/login');
        return;
      }

      if (!fetchedUser) {
        setUserToDisplay(null);
      } else {
        setUserToDisplay(fetchedUser);
      }
    };

    fetchUserData();
  }, [profileUserId, currentUser, navigate]);

  if (!userToDisplay) {
    return <p>Utilizador não encontrado</p>;
  }

  return (
    <div>
      <ProfileUI user={userToDisplay} isOwnProfile={isOwnProfile} />
      <UserProducts userId={userToDisplay.id} isOwnProfile={isOwnProfile} />
      <SellerEvaluations userId={userToDisplay.id} />
      {isOwnProfile && <ProfileEditForm userId={userToDisplay.id} />}
    </div>
  );
}

function UserProducts({ userId, isOwnProfile }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productAPI.getProductsBySeller(userId);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading user products:', error);
      }
    };

    fetchProducts();
  }, [userId]);

  if (products.length === 0) {
    return (
      <p className="no-products-message">
        {isOwnProfile
          ? 'Não tem produtos para venda.'
          : 'Este utilizador não tem produtos para venda.'}
      </p>
    );
  }

  return (
    <div className="card-container">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProfileUI({ user, isOwnProfile }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormPassword()) return;

    try {
      const result = await userAPI.updateUser(user.id, formData);
      if (result.produtos && result.produtos.length > 0) {
        const userProducts = await productComponent.getProductsByIds(result.produtos);
        result.produtos = userProducts;
      } else {
        result.produtos = [];
      }
      alert('Dados atualizados com sucesso!');
      setUser(result);
      window.location.reload();
    } catch (error) {
      alert('Erro ao atualizar os dados. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2 id="productsHeader">
        {isOwnProfile ? 'Os meus Produtos' : 'Produtos deste vendedor'}
      </h2>
      <form id="perfil-form" onSubmit={handleSubmit}>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          readOnly={!isEditMode}
        />
        {/* Adicione inputs similares para outros campos */}
        <img className="imagem-perfil" src={user.picture} alt="Profile" />
        {isOwnProfile && (
          <>
            <button type="button" onClick={toggleEditMode}>
              {isEditMode ? 'Cancelar' : 'Editar Informação do Utilizador'}
            </button>
            {isEditMode && (
              <>
                <div className="password-wrapper">
                  <input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="confirm-password-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Salvar Alterações</button>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
}

// Função auxiliar para validação de senha
function validateFormPassword() {
  // Implemente a lógica de validação de senha aqui
  return true; // Retorno simplificado para este exemplo
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    picture: '',
  });
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePasswords = () => {
    const { password, confirmPassword } = formData;
    if (!validatePassword(password)) {
      return 'A password deve ter pelo menos 8 caracteres, incluindo números e letras.';
    }
    if (password !== confirmPassword) {
      return 'As passwords não coincidem.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePasswords();
    if (passwordError) {
      alert(passwordError);
      return;
    }

    try {
      const usernameExists = await userAPI.checkUsername(formData.username);
      if (usernameExists) {
        setUsernameError('O username já existe. Por favor escolha outro.');
        return;
      }

      const newUser = { ...formData };
      await userAPI.registerUser(newUser);
      alert('Utilizador registado! Bem-vindo/a, ' + newUser.firstName);
      navigate('/login');
    } catch (error) {
      alert('Erro ao registar utilizador. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <form id="formulario_novo_registo" onSubmit={handleSubmit}>
      {/* Input fields aqui */}
      <button type="submit">Registar</button>
    </form>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userAPI.logoutUser();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

function DeleteUserButton({ userId }) {
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    if (!userId) {
      alert('Invalid user ID!');
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      alert('User deleted with success!');
      navigate('/admin');
    } catch (error) {
      alert('Error trying to delete user. Please try again!');
      console.error(error);
    }
  };

  return <button onClick={handleDeleteUser}>Apagar Utilizador</button>;
}

function SuspendUserButton({ userId }) {
  const navigate = useNavigate();

  const handleSuspendUser = async () => {
    if (!userId) {
      alert('Invalid user ID!');
      return;
    }

    try {
      await userAPI.suspendUser(userId);
      alert('User suspended with success!');
      navigate('/admin');
    } catch (error) {
      alert('Error trying to suspend user. Please try again!');
      console.error(error);
    }
  };

  return <button onClick={handleSuspendUser}>Suspender Utilizador</button>;
}

function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userAPI.logoutUser();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return handleLogout;
}

function useHardDeleteUser() {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const hardDeleteUser = async () => {
    if (!userId) {
      alert('Invalid user ID!');
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      alert('User deleted with success!');
      navigate('/admin');
    } catch (error) {
      alert('Error trying to delete user. Please try again!');
      console.error(error);
    }
  };

  return hardDeleteUser;
}

function useSoftDeleteUser() {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const softDeleteUser = async () => {
    if (!userId) {
      alert('Invalid user ID!');
      return;
    }

    try {
      await userAPI.suspendUser(userId);
      alert('User suspended with success!');
      navigate('/admin');
    } catch (error) {
      alert('Error trying to suspend user. Please try again!');
      console.error(error);
    }
  };

  return softDeleteUser;
}

export const userComponents = {
  LoginForm,
  UserProfile,
  ProfileUI,
  RegistrationForm,
  LogoutButton,
  DeleteUserButton,
  SuspendUserButton,
  useLogout,
  useHardDeleteUser,
  useSoftDeleteUser
};




