import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import WelcomeSection from '../components/admin/WelcomeSection';
import UserTable from '../components/admin/UserTable';

function AdminPage() {
  return (
    <>

      <main className="main-container">
        <AdminSidebar />

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<WelcomeSection />} />
            <Route path="/utilizadores" element={<UserTable />} />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </div>
      </main>

    </>
  );
}

export default AdminPage;
