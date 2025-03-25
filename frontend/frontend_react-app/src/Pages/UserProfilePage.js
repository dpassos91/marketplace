import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { userAPI } from '../api/userAPI';
import { productAPI } from '../api/productAPI';
import { categoryComponents } from '../components/categoryComponents';
import { evaluationComponents } from '../components/evaluationComponents';
import { userComponents } from '../components/userComponents';
import Aside from '../components/Aside';
import { productComponents } from '../components/productComponents';

const { ProductCard } = productComponents;
const { SellerEvaluations } = evaluationComponents;
const { ProfileInfo } = userComponents;

export default function UserProfilePage() {
    const [userToDisplay, setUserToDisplay] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const { id: profileUserId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('profileUserId:', profileUserId);
        console.log('currentUser:', currentUser);
        const fetchData = async () => {
            try {
                await fetchUserData();
                if (isOwnProfile) {
                    await fetchAllUserProducts();
                } else {
                    await fetchAvailableUserProducts();
                }
                await fetchEvaluations();
            } catch (error) {
                console.error('Erro ao carregar dados do perfil:', error);
            }
        };

        fetchData();
    }, [profileUserId, currentUser, isOwnProfile]);

    const fetchUserData = async () => {
        console.log('Fetching user data for ID:', profileUserId);
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
            const mockEvaluations = [
                { id: 1, author: 'User1', comment: 'Excelente produto!', rating: 5 },
                { id: 2, author: 'User2', comment: 'Muito bom!', rating: 4 },
            ];
            setEvaluations(mockEvaluations);
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        try {
            const result = await userAPI.updateUser(userToDisplay.id, updatedData);
            setUserToDisplay(result);
            console.log('Atualização bem-sucedida:', result);
            alert('Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro detalhado:', error);
            alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente mais tarde.');
        }
    }

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
                        <section className="reviewBtnsContainer"></section>
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
                <div className="container mt-5" id="evaluationsSection">
                    <div className="row">
                        <div className="col-12">
                            <h2>Avaliações / Reviews</h2>
                            <div id="evaluationsContainer" className="evaluations-container">
                                {evaluations.map((evaluation) => (
                                    <div key={evaluation.id} className="evaluation">
                                        <p>
                                            <strong>{evaluation.author}:</strong> {evaluation.comment} (Rating: {evaluation.rating})
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






