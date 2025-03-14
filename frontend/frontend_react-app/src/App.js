import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Aside from './Aside';
import MainContent from './MainContent';
import Footer from './Footer';
import './App.css';

// Importa outras páginas/componentes
import Admin from './Pages/Admin'; 
import Index from './Pages/Index'; 
import Login from './Pages/Login'; 
import Product_details from './Pages/Product_details'; 
import Product_total from './Pages/Product_total'; 
import Register from './Pages/Register'; 
import User from './Pages/User'; 

function App() {
  return (
    <Router>
      <Header />
      <main className="main-container">
        <Aside />
        {/* Configuração das rotas */}
        <Routes>
          <Route path="/" element={<MainContent />} /> {/* Página inicial */}
          <Route path="/" element={<Admin />} /> {/* Página inicial */}
          <Route path="/" element={<Index />} /> {/* Página inicial */}
          <Route path="/" element={<Login />} /> {/* Página inicial */}
          <Route path="/" element={<Product_details />} /> {/* Página inicial */}
          <Route path="/" element={<Product_total />} /> {/* Página inicial */}
          <Route path="/" element={<Register />} /> {/* Página inicial */}
          <Route path="/" element={<User />} /> {/* Página inicial */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;



