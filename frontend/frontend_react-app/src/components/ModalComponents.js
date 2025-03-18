import React, { useState, useEffect } from 'react';
import { addNewProduct } from './productComponent';

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
}

export function ProductForm({ onCancel, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o formulário
    onSubmit();
  };

  return (
    <form id="form-novo-produto" onSubmit={handleSubmit}>
      {/* Campos do formulário aqui */}
      <button type="submit">Adicionar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}

export function ProductModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    addNewProduct();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Resetar o formulário aqui, se necessário
  };

  const handleSubmit = () => {
    // Lógica para lidar com o envio do formulário
    closeModal();
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      if (event.target.className === 'modal') {
        closeModal();
      }
    };

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <>
      <button id="openModalBtn" onClick={openModal}>Abrir Modal</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProductForm onCancel={closeModal} onSubmit={handleSubmit} />
      </Modal>
    </>
  );
}
