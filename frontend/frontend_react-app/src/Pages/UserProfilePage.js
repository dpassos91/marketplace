import React, { useState, useEffect } from 'react';
import Aside from '../components/Aside';
import ProductCard from '../components/ProductCard'; // Certifique-se de ter este componente
import { userComponents } from '../components/userComponents';
import { useAuth } from '../hooks/UseAuth';
import { productAPI } from '../api/productAPI'; // Se já não estiver importado
import { userAPI } from '../api/userAPI'; // Se já não estiver importado

const { ProfileUI } = userComponents; // Importa apenas o que precisas
//Notei que faltava esta importação, por isso importei-a agora

function ProfilePage() {
  // Estado para os dados do utilizador
  const [user, setUser] = useState(null); // Alterado para null inicialmente
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Assumindo que é o perfil do próprio utilizador

  // Estado para os produtos do utilizador
  const [userProducts, setUserProducts] = useState([]);

  // Estado para as avaliações
  const [evaluations, setEvaluations] = useState([]);

  const { user: currentUser } = useAuth(); // Obtém o user do contexto de autenticação

  // Função para buscar os dados do utilizador (substitua pela sua lógica real)
  const fetchUserData = async () => {
    try {
      //Se currentUser existir, vai buscar as informações desse utilizador
      if (currentUser) {
        const userData = await userAPI.getUserById(currentUser.id);
        setUser(userData);
      } else {
        // Lidar com o caso em que o utilizador não está autenticado (redirecionar, mostrar mensagem, etc.)
        console.warn('Utilizador não autenticado.');
        //Exemplo:
        //return <Navigate to="/login" />;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do utilizador:', error);
    }
  };

  // Função para buscar os produtos do utilizador (substitua pela sua lógica real)
  const fetchUserProducts = async () => {
    // Substitua esta lógica com a sua chamada à API real
    try {
      if (currentUser) {
        const products = await productAPI.getProductsBySeller(currentUser.id);
        setUserProducts(products);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos do utilizador:', error);
    }
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
  }, [currentUser]); // Dependência em currentUser para refazer a busca quando o usuário muda

  // Se o utilizador ainda não foi carregado, mostrar mensagem de loading ou retornar null
  if (!user) {
    return <p>A carregar informações do utilizador...</p>; // Ou outro indicador de loading
  }

  return (
    <main className="main-container">
      <Aside />
      <div className="wrapper-pag-pessoal">
        <div className="info-pessoal">
          <div className="perfil-utilizador">
            <h2>Página Pessoal</h2>
            {/* Renderiza o componente ProfileUI, passando os dados necessários */}
            <ProfileUI user={user} isOwnProfile={isOwnProfile} />
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

