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
import ChangePasswordModal from '../components/user/ChangePasswordModal';

export default function PrivateUserProfilePage() {
  const { formatMessage } = useIntl();
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || String(currentUser.id) !== userId) {
      navigate('/');
    } else {
      fetchUserData();
    }
  }, [userId, currentUser]);

  const fetchUserData = async () => {
    try {
      const userData = await userAPI.getUserById(userId);
      const products = await productAPI.getProductsBySeller(userId);
      const fetchedEvaluations = await evaluationAPI.getEvaluationsForSeller(userId);

      setUserToDisplay(userData);
      setUserProducts(products);
      setEvaluations(fetchedEvaluations);
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const cleanedData = { ...updatedData };
      delete cleanedData.password;
      delete cleanedData.confirmPassword;
      const result = await userAPI.updateUser(userToDisplay.id, cleanedData);
      setUserToDisplay(result);
      alert(formatMessage({ id: 'userProfile.alert.updateSuccess', defaultMessage: 'Dados atualizados com sucesso!' }));
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert(formatMessage({ id: 'userProfile.alert.updateError', defaultMessage: 'Ocorreu um erro ao atualizar o perfil.' }));
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
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
    const fetchedEvaluations = await evaluationAPI.getEvaluationsForSeller(userId);
    setEvaluations(fetchedEvaluations);
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
              canEdit={true} 
              onUpdate={handleUpdateProfile} 
              onPasswordChange={handlePasswordChange}
            />
            <UserProductStats products={userProducts} />
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
            <FormattedMessage id="userProfile.myProducts" defaultMessage="Os meus Produtos" />
          </h1>
          <section className="card-container">
            {userProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </div>

        <div className="container mt-5" id="evaluationsSection">
          <SellerEvaluations 
            sellerId={userId}
            evaluations={evaluations}
            currentUser={currentUser}
            onAddEvaluation={handleAddEvaluationClick}
            onEditEvaluation={handleEditEvaluationClick}
            canEvaluate={false}
            canEditEvaluation={canEditEvaluation}
          />
        </div>

        {showEvaluationModal && (
          <EvaluationModal
            sellerId={userId}
            onClose={handleCloseEvaluationModal}
            onSubmit={handleEvaluationSubmitted}
            currentUser={currentUser}
            initialData={currentEvaluation}
          />
        )}

        {showPasswordModal && (
          <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={handleClosePasswordModal}
            userId={userId}
          />
        )}
      </div>
    </main>
  );
}



