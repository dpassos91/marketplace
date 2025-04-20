import React, { useState, useEffect } from 'react';
import { useFormInput } from '../../hooks/useFormInput';
import { FormattedMessage } from 'react-intl';
import { FaLock } from 'react-icons/fa';
import ChangePasswordModal from './ChangePasswordModal';
import './ProfileInfo.css';

function ProfileInfo({ user, canEdit, onUpdate }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, handleInputChange, setFormData] = useFormInput({ ...user });

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const toggleEditMode = () => {
        if (canEdit) {
            setIsEditMode(!isEditMode);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canEdit && isEditMode) {
            await onUpdate(formData);
            setIsEditMode(false);
        }
    };

    return (
        <form id="perfil-form" onSubmit={handleSubmit}>
            {canEdit && (
                <>
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
                    required
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
                    required
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
                            required
                        />
                    </div>
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
                            required
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
                            required
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
                            required
                        />
                    </div>
                </>
            )}

            {canEdit && !isEditMode && (
                <button type="button" onClick={toggleEditMode}>
                    <FormattedMessage id="profileInfo.edit" defaultMessage="Editar Perfil" />
                </button>
            )}

            {canEdit && isEditMode && (
                <>
                    <button type="submit">
                        <FormattedMessage id="profileInfo.save" defaultMessage="Guardar Alterações" />
                    </button>
                    <button type="button" onClick={toggleEditMode}>
                        <FormattedMessage id="profileInfo.cancel" defaultMessage="Cancelar" />
                    </button>
                </>
            )}

            {canEdit && (
                <button
                    type="button"
                    className="password-change-button"
                    onClick={() => setShowPasswordModal(true)}
                >
                    <FaLock /> <FormattedMessage id="profileInfo.changePassword" defaultMessage="Alterar Password" />
                </button>
            )}

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                userId={user?.id}
            />
        </form>
    );
}

export default ProfileInfo;
