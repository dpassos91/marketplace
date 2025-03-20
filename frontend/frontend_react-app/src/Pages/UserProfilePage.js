import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { categoryComponents } from '../components/categoryComponents';
import { evaluationComponents } from '../components/evaluationComponents';
import { userComponents } from '../components/userComponents';
import Aside from '../components/Aside';

const { ProductCard } = categoryComponents;
const { SellerEvaluations } = evaluationComponents;
const { ProfileEditForm } = userComponents;

export default function UserProfilePage() {
    const [userToDisplay, setUserToDisplay] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const { id: profileUserId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Função para buscar os dados do utilizador
    const fetchUserData = async () => {
        try {
            if (profileUserId) {
                const userData = await userAPI.getUserById(profileUserId);
                setIsOwnProfile(currentUser && String(currentUser.id) === String(profileUserId));
                setUserToDisplay(userData);
            } else if (currentUser) {
                const userData = await userAPI.getUserById(currentUser.id);
                setIsOwnProfile(true);
                setUserToDisplay(userData);
            } else {
                console.warn('Utilizador não autenticado.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Erro ao buscar dados do utilizador:', error);
        }
    };

    // Função para buscar os produtos do utilizador
    const fetchUserProducts = async () => {
        try {
            if (profileUserId || currentUser) {
                const userId = profileUserId || currentUser.id;
                const products = await productAPI.getProductsBySeller(userId);
                setUserProducts(products);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos do utilizador:', error);
        }
    };

    // Função para buscar as avaliações
    const fetchEvaluations = async () => {
        try {
            // Mock de avaliações (substitua pela chamada real à API)
            const mockEvaluations = [
                { id: 1, author: 'User1', comment: 'Excelente produto!', rating: 5 },
                { id: 2, author: 'User2', comment: 'Muito bom!', rating: 4 },
            ];
            setEvaluations(mockEvaluations);
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
        }
    };

    // Efeito para carregar os dados iniciais
    useEffect(() => {
        fetchUserData();
        fetchUserProducts();
        fetchEvaluations();
    }, [profileUserId, currentUser]);

    if (!userToDisplay) {
        return <p>A carregar informações do utilizador...</p>;
    }

    return (
      <main className="main-container">
      <Aside />
      <div className="wrapper-pag-pessoal">
          <div className="info-pessoal">
              <div className="perfil-utilizador">
                  <h2>Página Pessoal</h2>
                  {isOwnProfile && <ProfileEditForm user={userToDisplay} setUser={setUserToDisplay} />}
              </div>
              <div className="outras-info">
                  <section className="imagem-perfil-wrapper">
                      <img
                          className="imagem-perfil"
                          src={userToDisplay.picture}
                          alt="foto-perfil"
                      />
                  </section>
                  <section className="reviewBtnsContainer"></section>
              </div>
                </div>
                <div className="main-card-container">
                    <h1 id="productsHeader">Os meus Produtos</h1>
                    <section className="card-container">
                        {/* Renderiza os produtos do utilizador */}
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
                                {/* Renderiza as avaliações */}
                                {evaluations.map((evaluation) => (
                                    <div key={evaluation.id} className="evaluation">
                                        <p>
                                            <strong>{evaluation.author}:</strong> {evaluation.comment} (Rating:{' '}
                                            {evaluation.rating})
                                        </p>
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




