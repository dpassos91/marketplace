import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

function App() {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [login]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/detalhes-produto/:id" element={<ProductDetails />} /> 
          <Route path="/profile/:id" element={<UserProfilePage />} />
          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;







