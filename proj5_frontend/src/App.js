import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl'; // Adicionado
import { userStore } from './stores/UserStore'; // Adicionado
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/commons/Layout';
import ProtectedRoute from './utils/protectedRoute';
import ProductDetails from './components/product/ProductDetails';
import './App.css';
import useAuthStore from './stores/authStore';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminPage from './pages/AdminPage';
import languages from './translations';

function App() {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(true);
  const locale = userStore((state) => state.locale); 

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [login]);

  if (isLoading) {
    return (
      <div className="loading-screen" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              <FormattedMessage id="app.loading" />
            </span>
          </div>
          <p className="mt-2">
            <FormattedMessage id="app.loading" />
          </p>
        </div>
      </div>
    );
  }  

  return (
    <IntlProvider 
      locale={locale} 
      messages={languages[locale] || languages.pt} 
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registo" element={<RegisterPage />} />
            <Route path="/produtos" element={<ProductPage />} />
            <Route path="/detalhes-produto/:id" element={<ProductDetails />} /> 
            <Route path="/perfil/:id" element={<UserProfilePage />} />
            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil/:userId" element={<UserProfilePage />} />
              <Route path="/admin/*" element={<AdminPage />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </IntlProvider>
  );
}

export default App;








