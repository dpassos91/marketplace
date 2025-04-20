import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { userStore } from './stores/userStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import PublicUserProfilePage from './pages/PublicUserProfilePage';
import PrivateUserProfilePage from './pages/PrivateUserProfilePage';
import Layout from './components/commons/Layout';
import ProtectedRoute from './utils/protectedRoute';
import ProductDetails from './components/product/ProductDetails';
import './App.css';
import useAuthStore from './stores/authStore';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminPage from './pages/AdminPage';
import './responsive.css';
import useMediaType from './hooks/useMediaType';
import ConfirmAccount from './pages/ConfirmAccount';
import ResetPasswordPage from './pages/ResetPasswordPage';


function App() {
    const login = useAuthStore((state) => state.login);
    const [isLoading, setIsLoading] = useState(true);

    useMediaType();

    // Acesso ao store de utilizador
    const {
        locale,
        translations,
        initializeLanguage
    } = userStore();

    // Efeito para carregar dados iniciais
    useEffect(() => {
        const initializeApp = async () => {
            try {
                const storedUser = localStorage.getItem('userData');
                const token = sessionStorage.getItem('authToken');
    
                // ❗ Correção de sessão inválida
                if (storedUser && !token) {
                    console.warn("Sessão inválida: userData presente mas token em falta. A fazer logout...");
                    localStorage.removeItem('userData');
                } else if (storedUser && token) {
                    login(JSON.parse(storedUser));
                }
    
                initializeLanguage();
            } catch (error) {
                console.error("Erro na inicialização:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        initializeApp();
    }, [login, initializeLanguage]);
    

    if (isLoading) {
        return (
            <div className="loading-screen">
                Carregando...
            </div>
        );
    }

    return (
        <IntlProvider
            locale={locale}
            messages={translations}
            onError={(err) => {
                if (err.code === 'MISSING_TRANSLATION') {
                    console.warn('Erro de tradução:', err.message);
                }
            }}
        >
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registo" element={<RegisterPage />} />
                        <Route path="/produtos" element={<ProductPage />} />
                        <Route path="/detalhes-produto/:id" element={<ProductDetails />} />
                        <Route path="/perfil/:username" element={<PublicUserProfilePage />} />
                        <Route path="/confirmar" element={<ConfirmAccount />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/painel-utilizador/:userId" element={<PrivateUserProfilePage />} />
                            <Route path="/admin/*" element={<AdminPage />} />
                        </Route>
                    </Routes>
                </Layout>
            </Router>
        </IntlProvider>
    );
}

export default App;










