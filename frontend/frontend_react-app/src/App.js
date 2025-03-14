import React from 'react';
import Header from './Header';
import Aside from './Aside';
import MainContent from './MainContent';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <>
      {/* Renderiza os componentes criados */}
      <Header />
      <main className="main-container">
        <Aside />
        <MainContent />
      </main>
      <Footer />
    </>
  );
}

export default App;



