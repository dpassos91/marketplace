import React, { useState } from 'react';
import Modal from '../components/commons/Modal';
import { authAPI } from '../api/authAPI';

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await authAPI.requestPasswordReset(email);
      setStatusMessage("Foi enviado um link de recuperação (ver consola)");
      console.log("🔗 Link de recuperação:", `http://localhost:3000/reset-password?token=${result.token}`);
    } catch (error) {
      console.error("Erro ao pedir recuperação:", error);
      setStatusMessage("Não foi possível enviar o pedido. Verifique o email.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recuperar Password">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button type="submit">Pedir recuperação</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </div>
        {statusMessage && <p>{statusMessage}</p>}
      </form>
    </Modal>
  );
}

export default ForgotPasswordModal;

