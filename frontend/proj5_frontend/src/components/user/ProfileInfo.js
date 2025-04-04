import React, { useState, useEffect } from 'react';
import { useFormInput } from '../../hooks/useFormInput';

function ProfileInfo({ user, isOwnProfile, onUpdate }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, handleInputChange, setFormData] = useFormInput({ ...user });

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const toggleEditMode = () => {
        if (isOwnProfile) {
            setIsEditMode(!isEditMode);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isOwnProfile) {
            await onUpdate(formData);
            setIsEditMode(false);
        }
    };

    return (
        <form id="perfil-form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    readOnly={!isEditMode}
                />
            </div>
            
            {isOwnProfile && (
                <>
                <div>
                <label htmlFor="lastName">Apelido:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditMode}
                />
            </div>
                <div>
                <label htmlFor="firstName">Nome:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                </>
            )}
            {isOwnProfile && (
                !isEditMode ? (
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
                )
            )}
        </form>
    );
}

export default ProfileInfo;