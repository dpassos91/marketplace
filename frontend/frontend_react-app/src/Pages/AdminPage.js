import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import WelcomeSection from '../components/admin/WelcomeSection';
//import UserManagement from './UserManagement';
//import ProductManagement from './ProductManagement';
//import EvaluationManagement from './EvaluationManagement';
//import EditProducts from './EditProducts';
//import AlterProducts from './AlterProducts';
//import Filters from './Filters';

function AdminPage() {
  return (
    <>
      <header id="header"></header>

      <main className="main-container">
        <AdminSidebar />

        <div className="admin-content">
          <WelcomeSection />
          {/* <UserManagement /> */}
            {/* <ProductManagement /> */}
{/* <EvaluationManagement /> */}
{/* <EditProducts /> */}
{/* <AlterProducts /> */}
{/* <Filters /> */}
        </div>
      </main>

      <footer id="footer"></footer>
    </>
  );
}

export default AdminPage;
