import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { evaluationAPI } from '../api/evaluationAPI';
import Aside from '../components/Aside';
import { productComponents } from '../components/productComponents';
import { evaluationComponents } from '../components/evaluationComponents';
import { userComponents } from '../components/userComponents';

const { ProductCard } = productComponents;
const { ProfileInfo } = userComponents;
const { SellerEvaluations, AddEvaluationModal } = evaluationComponents;

export default function UserProfilePage() {
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [canEvaluate, setCanEvaluate] = useState(false); // Novo estado para verificar elegibilidade
  const [showAddEvaluationModal, setShowAddEvaluationModal] = useState(false);
  const { id: profileUserId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Carrega dados do perfil e verifica elegibilidade para avaliação
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData();
        if (isOwnProfile) {
          await fetchAllUserProducts();
        } else {
          await fetchAvailableUserProducts();
        }
        await fetchEvaluations();
        await checkEvaluationEligibility(); // Verifica se o usuário pode avaliar o vendedor
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    fetchData();
  }, [profileUserId, currentUser, isOwnProfile]);

  // Função para buscar dados do utilizador
  const fetchUserData = async () => {
    try {
      if (profileUserId) {
        const userData = await userAPI.getUserById(profileUserId);
        setUserToDisplay(userData);
        setIsOwnProfile(currentUser && String(currentUser.id) === String(profileUserId));
      } else {
        console.warn('ID do usuário não fornecido na URL.');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do utilizador:', error);
    }
  };

  // Função para buscar todos os produtos do utilizador
  const fetchAllUserProducts = async () => {
    try {
      if (profileUserId) {
        const products = await productAPI.getProductsBySeller(profileUserId);
        setUserProducts(products);
      }
    } catch (error) {
      console.error('Erro ao buscar todos os produtos do utilizador:', error);
    }
  };

  // Função para buscar apenas produtos disponíveis
  const fetchAvailableUserProducts = async () => {
    try {
      if (profileUserId) {
        const products = await productAPI.getProductsBySeller(profileUserId);
        const availableProducts = products.filter(product => product.status === 'Disponível');
        setUserProducts(availableProducts);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos disponíveis do utilizador:', error);
    }
  };

  // Função para buscar avaliações do vendedor
  const fetchEvaluations = async () => {
    try {
      const fetchedEvaluations = await evaluationAPI.getEvaluationsForSeller(profileUserId);
      setEvaluations(fetchedEvaluations);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  // Função para verificar se o usuário pode avaliar o vendedor
  const checkEvaluationEligibility = async () => {
    if (currentUser && profileUserId && !isOwnProfile) {
      try {
        const eligibleProducts = await evaluationAPI.getEligibleProductsForEvaluation(currentUser.id);
        const hasPurchasedFromSeller = eligibleProducts.some(product => product.sellerId == profileUserId);
        setCanEvaluate(hasPurchasedFromSeller); // Define se o usuário pode avaliar
      } catch (error) {
        console.error('Erro ao verificar elegibilidade para avaliação:', error);
        setCanEvaluate(false); // Define como falso em caso de erro
      }
    }
  };

  // Função para atualizar o perfil do utilizador
  const handleUpdateProfile = async (updatedData) => {
    try {
      const result = await userAPI.updateUser(userToDisplay.id, updatedData);
      setUserToDisplay(result);
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente mais tarde.');
    }
  };

  // Funções para abrir e fechar o modal de avaliação
  const handleAddEvaluationClick = () => setShowAddEvaluationModal(true);

  const handleCloseAddEvaluationModal = () => setShowAddEvaluationModal(false);

  // Função chamada após uma avaliação ser adicionada
  const handleEvaluationAdded = async () => {
    await fetchEvaluations(); // Recarrega as avaliações
    setShowAddEvaluationModal(false); // Fecha o modal
  };

  if (!userToDisplay) return <p>A carregar informações do utilizador...</p>;

  return (
    <main className="main-container">
      <Aside />
      <div className="wrapper-pag-pessoal">
        <div className="info-pessoal">
          <div className="perfil-utilizador">
            <h2>Página Pessoal</h2>
            <ProfileInfo 
              user={userToDisplay} 
              isOwnProfile={isOwnProfile} 
              onUpdate={handleUpdateProfile} 
            />
          </div>
          <div className="outras-info">
            <section className="imagem-perfil-wrapper">
              <img 
                className="imagem-perfil" 
                src={userToDisplay.picture} 
                alt="foto-perfil" 
              />
            </section>
          </div>
        </div>
        
        <div className="main-card-container">
          <h1 id="productsHeader">{isOwnProfile ? "Os meus Produtos" : "Produtos do Vendedor"}</h1>
          <section className="card-container">
            {userProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </div>

        {/* Avaliações */}
        <div className="container mt-5" id="evaluationsSection">
          <SellerEvaluations 
            sellerId={profileUserId}
            evaluations={evaluations}
            currentUser={currentUser}
            onAddEvaluation={handleAddEvaluationClick}
            canEvaluate={canEvaluate} // Passa a elegibilidade como prop
          />
        </div>

        {/* Modal de Adicionar Avaliação */}
        {showAddEvaluationModal && (
          <AddEvaluationModal 
            sellerId={profileUserId} 
            onClose={handleCloseAddEvaluationModal} 
            onSubmit={handleEvaluationAdded} 
          />
        )}
      </div>
    </main>
  );
}








