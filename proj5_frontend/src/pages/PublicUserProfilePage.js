import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { evaluationAPI } from '../api/evaluationAPI';
import Aside from '../components/commons/Aside';
import ProfileInfo from '../components/user/ProfileInfo';
import SellerEvaluations from '../components/evaluation/SellerEvaluations';
import EvaluationModal from '../components/evaluation/EvaluationModal';
import ProductCard from '../components/product/ProductCard';
import { useIntl, FormattedMessage } from 'react-intl';
import SpinnerLeaf from '../components/commons/SpinnerLeaf';
import UserProductStats from '../components/user/UserProductStats';

export default function UserProfilePage() {
  const { formatMessage } = useIntl();
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [canEvaluate, setCanEvaluate] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const { id: profileUserId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
        await checkEvaluationEligibility();
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    fetchData();
  }, [profileUserId, currentUser, isOwnProfile]);

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

  const fetchEvaluations = async () => {
    try {
      const fetchedEvaluations = await evaluationAPI.getEvaluationsForSeller(profileUserId);
      setEvaluations(fetchedEvaluations);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const checkEvaluationEligibility = async () => {
    if (currentUser && profileUserId && !isOwnProfile) {
      try {
        const eligibleProducts = await evaluationAPI.checkEligibility(currentUser.id);
        const hasPurchasedFromSeller = eligibleProducts.some(product => product.sellerId == profileUserId);
        setCanEvaluate(hasPurchasedFromSeller);
      } catch (error) {
        console.error('Erro ao verificar elegibilidade para avaliação:', error);
        setCanEvaluate(false);
      }
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const result = await userAPI.updateUser(userToDisplay.id, updatedData);
      setUserToDisplay(result);
      alert(formatMessage({ id: 'userProfile.alert.updateSuccess', defaultMessage: 'Dados atualizados com sucesso!' }));
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert(formatMessage({ id: 'userProfile.alert.updateError', defaultMessage: 'Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente mais tarde.' }));
    }
  };

  const handleAddEvaluationClick = () => {
    setCurrentEvaluation(null);
    setShowEvaluationModal(true);
  };

  const handleEditEvaluationClick = (evaluation) => {
    setCurrentEvaluation(evaluation);
    setShowEvaluationModal(true);
  };

  const handleCloseEvaluationModal = () => {
    setShowEvaluationModal(false);
    setCurrentEvaluation(null);
  };

  const handleEvaluationSubmitted = async () => {
    await fetchEvaluations();
    setShowEvaluationModal(false);
    setCurrentEvaluation(null);
  };

  const canEditEvaluation = (evaluation) => {
    return currentUser && evaluation.evaluatorId === currentUser.id;
  };

  if (!userToDisplay) {
    return (
      <div className="loading-container">
        <SpinnerLeaf />
        <p>
          <FormattedMessage
            id="userProfile.loading"
            defaultMessage="A carregar informações do utilizador..."
          />
        </p>
      </div>
    );
  }
  

  return (
    <main className="main-container">
      <Aside />
      <div className="wrapper-pag-pessoal">
        <div className="info-pessoal">
          <div className="perfil-utilizador">
            <h2><FormattedMessage id="userProfile.title" defaultMessage="Página Pessoal" /></h2>
            <ProfileInfo 
              user={userToDisplay} 
              isOwnProfile={isOwnProfile} 
              onUpdate={handleUpdateProfile} 
            />
            {isOwnProfile && (
  <UserProductStats products={userProducts} />
)}
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
          <h1 id="productsHeader">
            <FormattedMessage
              id={isOwnProfile ? "userProfile.myProducts" : "userProfile.sellerProducts"}
              defaultMessage={isOwnProfile ? "Os meus Produtos" : "Produtos do Vendedor"}
            />
          </h1>
          <section className="card-container">
            {userProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </div>

        <div className="container mt-5" id="evaluationsSection">
          <SellerEvaluations 
            sellerId={profileUserId}
            evaluations={evaluations}
            currentUser={currentUser}
            onAddEvaluation={handleAddEvaluationClick}
            onEditEvaluation={handleEditEvaluationClick}
            canEvaluate={canEvaluate}
            canEditEvaluation={canEditEvaluation}
          />
        </div>

        {showEvaluationModal && (
          <EvaluationModal
            sellerId={profileUserId}
            onClose={handleCloseEvaluationModal}
            onSubmit={handleEvaluationSubmitted}
            currentUser={currentUser}
            initialData={currentEvaluation}
          />
        )}
      </div>
    </main>
  );
}









