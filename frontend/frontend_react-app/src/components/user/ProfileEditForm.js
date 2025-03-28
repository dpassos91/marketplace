import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Importe o hook
import { userAPI } from '../../api/userAPI';
import { productAPI } from '../../api/productAPI';
import { useFormInput } from '../../hooks/useFormInput'; // Importe o hook

function ProfileEditForm({ user }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, handleInputChange, setFormData] = useFormInput({ ...user }); // Use o hook
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    setFormData({ ...user }); // Atualiza o formulário quando o usuário muda
  }, [user, setFormData]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await userAPI.updateUser(user.id, formData);

      if (result.produtos && result.produtos.length > 0) {
        const userProducts = await productAPI.getProductById(result.produtos);
        result.produtos = userProducts;
      } else {
        result.produtos = [];
      }

      alert('Dados atualizados com sucesso!');
      setCurrentUser(result); // Atualiza o contexto de autenticação
      window.location.reload();
    } catch (error) {
      alert('Erro ao atualizar os dados. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <form id="perfil-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">Nome:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName || ''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="lastName">Apelido:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName || ''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username || ''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirme a Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="phone">Telefone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          maxLength="9"
          minLength="9"
          value={formData.phone || ''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      <div>
        <label htmlFor="picture">Fotografia:</label>
        <input
          type="text"
          id="picture"
          name="picture"
          value={formData.picture || ''}
          onChange={handleInputChange} // Use o handleInputChange do hook
          readOnly={!isEditMode}
        />
      </div>
      {!isEditMode ? (
        <button type="button" onClick={toggleEditMode}>
          Editar Perfil
        </button>
      ) : (
        <>
          <button type="submit">Salvar Alterações</button>
          <button type="button" onClick={toggleEditMode}>
            Cancelar
          </button>
        </>
      )}
    </form>
  );
}

export default ProfileEditForm;
