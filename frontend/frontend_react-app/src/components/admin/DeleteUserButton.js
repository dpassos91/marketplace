// src/components/DeleteUserButton.js
import React from 'react';
import { useHardDeleteUser } from '../hooks/useHardDeleteUser';

function DeleteUserButton({ userId }) {
  const { hardDeleteUser } = useHardDeleteUser();

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja eliminar este utilizador?')) {
      try {
        await hardDeleteUser(userId);
        alert('Utilizador eliminado com sucesso!');
        // Redirecionar ou atualizar a lista de utilizadores
      } catch (error) {
        console.error('Erro ao eliminar utilizador:', error);
        alert('Erro ao eliminar utilizador. Tente novamente.');
      }
    }
  };

  return (
    <button onClick={handleDelete}>Eliminar Utilizador</button>
  );
}

export default DeleteUserButton;
