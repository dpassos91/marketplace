import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import WelcomeSection from '../components/admin/WelcomeSection';
import UserTable from '../components/admin/UserTable';
import InactiveProductsTable from '../components/admin/InactiveProductsTable';
import AddCategoryModal from '../components/admin/AddCategoryModal';
import FilterProductsByCategory from '../components/admin/FilterProductsByCategory';
import FilterProductsBySeller from '../components/admin/FilterProductsBySeller';
import AdminProductsPage from '../components/admin/AdminProductsPage'; // Importe a página de produtos

function AdminPage() {
  return (
    <>
      <main className="main-container">
        <AdminSidebar />

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<WelcomeSection />} />
            <Route path="/utilizadores" element={<UserTable />} />
            <Route path="/produtos" element={<AdminProductsPage />} /> {/* Rota para a página de produtos */}
            <Route path="/produtos/inativos" element={<InactiveProductsTable />} />
            <Route path="/produtos/filtrar-categoria" element={<FilterProductsByCategory />} />
            <Route path="/produtos/filtrar-vendedor" element={<FilterProductsBySeller />} />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </div>
      </main>
    </>
  );
}

export default AdminPage;

