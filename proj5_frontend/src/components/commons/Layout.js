import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AddProductModal from '../../components/product/AddProductModal';
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <Header />
      <main>{children}</main>
      <AddProductModal />
      <Footer />
    </div>
  );
}

export default Layout;
