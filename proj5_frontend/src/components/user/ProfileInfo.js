import React, { useState, useEffect } from 'react';
import { useFormInput } from '../../hooks/useFormInput';
import { FormattedMessage } from 'react-intl';

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
                <label htmlFor="username">
                    <FormattedMessage id="profileInfo.username" defaultMessage="Username:" />
                </label>
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
                <label htmlFor="email">
                    <FormattedMessage id="profileInfo.email" defaultMessage="Email:" />
                </label>
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
                        <label htmlFor="lastName">
                            <FormattedMessage id="profileInfo.lastName" defaultMessage="Apelido:" />
                        </label>
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
                        <label htmlFor="firstName">
                            <FormattedMessage id="profileInfo.firstName" defaultMessage="Nome:" />
                        </label>
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
                        <label htmlFor="phone">
                            <FormattedMessage id="profileInfo.phone" defaultMessage="Telefone:" />
                        </label>
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
                        <label htmlFor="picture">
                            <FormattedMessage id="profileInfo.picture" defaultMessage="Fotografia:" />
                        </label>
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
                        <label htmlFor="password">
                            <FormattedMessage id="profileInfo.password" defaultMessage="Password:" />
                        </label>
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
                        <label htmlFor="confirmPassword">
                            <FormattedMessage id="profileInfo.confirmPassword" defaultMessage="Confirme a Password:" />
                        </label>
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
                        <FormattedMessage id="profileInfo.edit" defaultMessage="Editar Perfil" />
                    </button>
                ) : (
                    <>
                        <button type="submit">
                            <FormattedMessage id="profileInfo.save" defaultMessage="Salvar Alterações" />
                        </button>
                        <button type="button" onClick={toggleEditMode}>
                            <FormattedMessage id="profileInfo.cancel" defaultMessage="Cancelar" />
                        </button>
                    </>
                )
            )}
        </form>
    );
}

export default ProfileInfo;

