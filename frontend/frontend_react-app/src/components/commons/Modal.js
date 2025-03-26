// Modal.js
import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{title}</h2> {/* Adiciona o título ao modal */}
        {children}
      </div>
    </div>
  );
}

export default Modal;
