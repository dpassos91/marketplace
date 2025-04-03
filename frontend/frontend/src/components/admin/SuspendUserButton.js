// src/components/SuspendUserButton.js
import React from 'react';
import { useSoftDeleteUser } from '../hooks/useSoftDeleteUser';

function SuspendUserButton({ userId }) {
  const { softDeleteUser } = useSoftDeleteUser();

  const handleSuspend = async () => {
    if (window.confirm('Tem certeza que deseja suspender este utilizador?')) {
      try {
        await softDeleteUser(userId);
        alert('Utilizador suspenso com sucesso!');
        // Redirecionar ou atualizar a lista de utilizadores
      } catch (error) {
        console.error('Erro ao suspender utilizador:', error);
        alert('Erro ao suspender utilizador. Tente novamente.');
      }
    }
  };

  return (
    <button onClick={handleSuspend}>Suspender Utilizador</button>
  );
}

export default SuspendUserButton;
