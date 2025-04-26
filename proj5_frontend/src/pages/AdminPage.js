import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import WelcomeSection from '../components/admin/WelcomeSection';
import UserTable from '../components/admin/UserTable';
import EvaluationsTable from '../components/admin/EvaluationsTable';
import InactiveProductsTable from '../components/admin/InactiveProductsTable';
import AlteredProducts from '../components/admin/AlteredProducts';
import AdminProductsPage from '../components/admin/AdminProductsPage'; 
import AdminDashboard from '../components/admin/AdminDashboard'; // Importa o componente Dashboard

function AdminPage() {
  return (
    <>
      <main className="main-container">
        <AdminSidebar />

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<WelcomeSection />} />
            <Route path="/avaliacoes" element={<EvaluationsTable />} />
            <Route path="/produtos" element={<AdminProductsPage />} /> {/* Rota para a página de produtos */}
            <Route path="/produtos/alterados" element={<AlteredProducts />} />
            {/*<Route path="/produtos/comprados" element={<AlteredProducts />} /> */}
            <Route path="/produtos/inativos" element={<InactiveProductsTable />} />
            <Route path="/utilizadores" element={<UserTable />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </div>
      </main>
    </>
  );
}

export default AdminPage;

