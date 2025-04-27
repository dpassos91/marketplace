import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { evaluationAPI } from '../api/evaluationAPI';
import { useAuth } from '../hooks/useAuth';
import SpinnerLeaf from '../components/commons/SpinnerLeaf';
import ProductCard from '../components/product/ProductCard';
import SellerEvaluations from '../components/evaluation/SellerEvaluations';
import EvaluationModal from '../components/evaluation/EvaluationModal';
import { FormattedMessage, useIntl } from 'react-intl';
import ChatWindow from '../components/chat/ChatWindow';
import './PublicUserProfilePage.css';

export default function PublicUserProfilePage() {
  const [showChat, setShowChat] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [canEvaluate, setCanEvaluate] = useState(false);
  const [eligibleProducts, setEligibleProducts] = useState([]);

  const { formatMessage } = useIntl();
  const { username } = useParams();
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const profileData = await userAPI.getUserProfile(username);
        setProfile(profileData);

        const user = await userAPI.getUserByUsername(username);
        const userId = user.id;

        const allProducts = await productAPI.getProductsBySeller(userId);
        const availableProducts = allProducts.filter(p => p.status === 'Disponível');
        setProducts(availableProducts);

        const evaluationsData = await evaluationAPI.getEvaluationsForSeller(userId);
        setEvaluations(evaluationsData);

        // 🚀 Verifica se o utilizador atual pode avaliar este vendedor
        if (currentUser && currentUser.username !== username) {
          const eligible = await evaluationAPI.checkEligibility(currentUser.id);
          const productsForThisSeller = eligible.filter(p => p.sellerId === userId);

          if (productsForThisSeller.length > 0) {
            setCanEvaluate(true);
            setEligibleProducts(productsForThisSeller);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do utilizador:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username, currentUser]);

  const handleEvaluationSubmitted = async () => {
    try {
      const user = await userAPI.getUserByUsername(username);
      const userId = user.id;

      const updatedEvaluations = await evaluationAPI.getEvaluationsForSeller(userId);
      setEvaluations(updatedEvaluations);
    } catch (error) {
      console.error('Erro ao atualizar avaliações:', error);
    } finally {
      setShowEvaluationModal(false);
    }
  };

  if (loading) {
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

  if (!profile) {
    return (
      <div className="error-container">
        <p>
          <FormattedMessage
            id="userProfile.notFound"
            defaultMessage="Perfil não encontrado."
          />
        </p>
      </div>
    );
  }

  return (
    <>
      <main className="public-profile-container">
        <section className="user-info">
          <img src={profile.photoUrl} alt="Foto de perfil" className="profile-image" />
          <div className="user-details">
            <h1>{profile.firstName} {profile.lastName}</h1>
            <p className="username">👤 @{profile.username}</p>
            <p className="email">✉️ {profile.email}</p>
          </div>

          <button onClick={() => setShowChat(true)} className="message-button">
            <FormattedMessage id="userProfile.sendMessage" defaultMessage="Enviar mensagem" />
          </button>

          {canEvaluate && (
            <button onClick={() => setShowEvaluationModal(true)} className="message-button">
              <FormattedMessage id="userProfile.addEvaluation" defaultMessage="Adicionar Avaliação" />
            </button>
          )}
        </section>

        <section className="user-stats">
          <h3>
            <FormattedMessage id="userProfile.statsTitle" defaultMessage="Estatísticas dos Produtos" />
          </h3>
          <div className="stats-grid">
            <div className="stat-card total">
              📦
              <span className="label">
                <FormattedMessage id="userProfile.totalProducts" defaultMessage="Total" />
              </span>
              <span className="value">{profile.totalProducts}</span>
            </div>

            {profile.productsByState &&
              Object.entries(profile.productsByState).map(([estado, count]) => {
                const emojiMap = {
                  "Rascunho": "📝",
                  "Disponível": "✅",
                  "Reservado": "🔒",
                  "Comprado": "💰"
                };
                const emoji = emojiMap[estado] || "📦";

                return (
                  <div key={estado} className="stat-card">
                    {emoji}
                    <span className="label">{estado}</span>
                    <span className="value">{count}</span>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="products-section">
          <h2>
            <FormattedMessage id="userProfile.sellerProducts" defaultMessage="Produtos do Vendedor" />
          </h2>
          <div className="product-list">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>
                <FormattedMessage
                  id="userProfile.noAvailableProducts"
                  defaultMessage="Este vendedor não tem produtos disponíveis de momento."
                />
              </p>
            )}
          </div>
        </section>

        <section className="evaluations-section">
          <SellerEvaluations
            sellerId={null}
            evaluations={evaluations}
            currentUser={currentUser}
            canEvaluate={false}
            canEditEvaluation={() => false}
          />
        </section>
      </main>

      {showChat && (
        <ChatWindow
          receiverUsername={profile.username}
          onClose={() => setShowChat(false)}
        />
      )}

      {showEvaluationModal && (
        <EvaluationModal
          sellerId={profile.id}
          onClose={() => setShowEvaluationModal(false)}
          onSubmit={handleEvaluationSubmitted}
          currentUser={currentUser}
          eligibleProducts={eligibleProducts} // enviamos diretamente!
        />
      )}
    </>
  );
}










