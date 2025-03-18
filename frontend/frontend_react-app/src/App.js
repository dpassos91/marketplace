import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/commons/Layout';
import './App.css';
import useAuthStore from './stores/authStore';



function App() {

  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
  }, [login]);

  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
      </Layout>
    </Router>
  );
}

export default App;





