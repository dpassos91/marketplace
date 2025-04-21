import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { evaluationAPI } from '../api/evaluationAPI';
import SpinnerLeaf from '../components/commons/SpinnerLeaf';
import ProductCard from '../components/product/ProductCard';
import SellerEvaluations from '../components/evaluation/SellerEvaluations';
import { FormattedMessage, useIntl } from 'react-intl';
import ChatWindow from '../components/chat/ChatWindow'; // ajusta o caminho conforme o teu projeto
import './PublicUserProfilePage.css';

export default function PublicUserProfilePage() {
  const [showChat, setShowChat] = useState(false);
  const { formatMessage } = useIntl();
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const profileData = await userAPI.getUserProfile(username);
        setProfile(profileData);
      } catch (err) {
        console.error('Erro ao carregar dados do utilizador:', err);
      }

      try {
        const user = await userAPI.getUserByUsername(username);
        const userId = user.id;

        const allProducts = await productAPI.getProductsBySeller(userId);
        const availableProducts = allProducts.filter(p => p.status === 'Disponível');
        setProducts(availableProducts);

        const evaluationsData = await evaluationAPI.getEvaluationsForSeller(userId);
        setEvaluations(evaluationsData);
      } catch (err) {
        console.error('Erro ao carregar produtos ou avaliações:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

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
    <p className="email">
      ✉️ {profile.email}
    </p>
  </div>
  <button onClick={() => setShowChat(true)} className="message-button">
  <FormattedMessage id="userProfile.sendMessage" defaultMessage="Enviar mensagem" />
</button>
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

    const emoji = emojiMap[estado] || "📦"; // fallback genérico

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
          currentUser={null}
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
      </>
  );
}










