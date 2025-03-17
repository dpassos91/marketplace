import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NewProductModal from './NewProductModal';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <NewProductModal />
      <Footer />
    </>
  );
}

export default Layout;
