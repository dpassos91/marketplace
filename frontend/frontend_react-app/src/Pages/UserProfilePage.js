// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import Aside from '../components/Aside';
import ProductCard from '../components/ProductCard'; // Certifique-se de ter este componente

function ProfilePage() {
  // Estado para os dados do utilizador
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    picture: '',
  });

  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);

  // Estado para os produtos do utilizador
  const [userProducts, setUserProducts] = useState([]);

  // Estado para as avaliações
  const [evaluations, setEvaluations] = useState([]);

  // Função para buscar os dados do utilizador (substitua pela sua lógica real)
  const fetchUserData = async () => {
    // Substitua esta lógica com a sua chamada à API real
    const mockUserData = {
      firstName: 'Diogo',
      lastName: 'Alves',
      username: 'diogoalves',
      phone: '912345678',
      email: 'diogo@example.com',
      picture: 'https://via.placeholder.com/150', // Substitua com o link real
    };

    setUser(mockUserData);
  };

  // Função para buscar os produtos do utilizador (substitua pela sua lógica real)
  const fetchUserProducts = async () => {
    // Substitua esta lógica com a sua chamada à API real
    const mockProducts = [
      { id: 1, name: 'Produto 1', description: 'Descrição do produto 1', price: 20 },
      { id: 2, name: 'Produto 2', description: 'Descrição do produto 2', price: 30 },
    ];

    setUserProducts(mockProducts);
  };

  // Função para buscar as avaliações (substitua pela sua lógica real)
  const fetchEvaluations = async () => {
    // Substitua esta lógica com a sua chamada à API real
    const mockEvaluations = [
      { id: 1, author: 'User1', comment: 'Excelente produto!', rating: 5 },
      { id: 2, author: 'User2', comment: 'Muito bom!', rating: 4 },
    ];

    setEvaluations(mockEvaluations);
  };

  // Efeito para buscar os dados ao montar o componente
  useEffect(() => {
    fetchUserData();
    fetchUserProducts();
    fetchEvaluations();
  }, []);

  // Função para alternar o modo de edição
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Função para lidar com as alterações nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você faria a chamada à API para salvar as alterações
    console.log('Dados a serem salvos:', user);
    setIsEditing(false);
  };

  return (
    <main className="main-container">
      <Aside />
      <div className="wrapper-pag-pessoal">
        <div className="info-pessoal">
          <div className="perfil-utilizador">
            <h2>Página Pessoal</h2>
            <form id="perfil-form" onSubmit={handleSubmit}>
              <section className="nome-wrapper">
                <label htmlFor="firstName">Primeiro nome:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={user.firstName}
                  required
                  readOnly={!isEditing}
                  placeholder="Primeiro nome"
                  onChange={handleInputChange}
                />
              </section>
              <section className="nome-wrapper">
                <label htmlFor="lastName">Último nome:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={user.lastName}
                  required
                  readOnly={!isEditing}
                  placeholder="Último nome"
                  onChange={handleInputChange}
                />
              </section>
              <section className="username-wrapper">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.username}
                  readOnly
                  onChange={handleInputChange}
                />
              </section>
              <section className="telefone-wrapper">
                <label htmlFor="phone">Telefone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  required
                  readOnly={!isEditing}
                  placeholder="Telefone"
                  onChange={handleInputChange}
                />
              </section>
              <section className="email-wrapper">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  required
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </section>
              <section className="img-link-wrapper">
                <label htmlFor="picture">Foto de Perfil: (Link)</label>
                <input
                  type="profile-pic"
                  id="picture"
                  name="picture"
                  value={user.picture}
                  required
                  readOnly={!isEditing}
                  placeholder="Link para a foto de perfil"
                  onChange={handleInputChange}
                />
              </section>
              <section className="buttons-wrapper">
                <button
                  type="button"
                  className="editar-pag-pessoal"
                  id="toggle-readonly"
                  onClick={toggleEditMode}
                >
                  {isEditing ? 'Cancelar Edição' : 'Editar Informação do Utilizador'}
                </button>
                {isEditing && (
                  <button type="submit" className="save-user-changes" title="Guardar alterações">
                    Guardar
                  </button>
                )}
              </section>
            </form>
          </div>
          <div className="outras-info">
            <section className="imagem-perfil-wrapper">
              <img className="imagem-perfil" src={user.picture} alt="foto-perfil" />
            </section>
            <section className="reviewBtnsContainer"></section>
          </div>
        </div>
        <div className="main-card-container">
          <h1 id="productsHeader">Os meus Produtos</h1>
          <section className="card-container">
            {userProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </div>
        <div className="container mt-5" id="evaluationsSection">
          <div className="row">
            <div className="col-12">
              <h2>Avaliações / Reviews</h2>
              <div id="evaluationsContainer" className="evaluations-container">
                {evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="evaluation">
                    <p><strong>{evaluation.author}:</strong> {evaluation.comment} (Rating: {evaluation.rating})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
