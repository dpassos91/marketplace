import { useState, useEffect } from 'react';
import { userAPI } from '../api/userAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

function useUserProfile() {
    const [userToDisplay, setUserToDisplay] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id: profileUserId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                let fetchedUser;
                if (profileUserId) {
                    fetchedUser = await userAPI.getUserById(profileUserId);
                } else if (currentUser) {
                    fetchedUser = await userAPI.getUserById(currentUser.id);
                } else {
                    navigate('/login');
                    return;
                }

                if (!fetchedUser) {
                    setUserToDisplay(null);
                } else {
                    setUserToDisplay(fetchedUser);
                }
                setIsOwnProfile(currentUser && currentUser.id === Number(profileUserId));

            } catch (error) {
                console.error('Falha ao carregar os dados do utilizador:', error);
                setError('Falha ao carregar os dados do utilizador.');
                setUserToDisplay(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [profileUserId, currentUser, navigate]);

    return { userToDisplay, isOwnProfile, loading, error };
}

export default useUserProfile;
