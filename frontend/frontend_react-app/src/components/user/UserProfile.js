import React from 'react';
import useUserProfile from '../hooks/useUserProfile';
import UserProducts from './UserProducts';

function UserProfile() {
    const { userToDisplay, isOwnProfile } = useUserProfile();

    if (!userToDisplay) {
        return <p>Utilizador não encontrado</p>;
    }

    return (
        <div>
            <UserProducts userId={userToDisplay.id} isOwnProfile={isOwnProfile} />
        </div>
    );
}
