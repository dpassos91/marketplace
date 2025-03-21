import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AddProductModal from '../AddProductModal';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <AddProductModal />
      <Footer />
    </>
  );
}

export default Layout;
