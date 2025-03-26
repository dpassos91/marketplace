import { useState, useEffect } from 'react';
import { userAPI } from '../api/userAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

function useUserProfile() {
    const [userToDisplay, setUserToDisplay] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const { id: profileUserId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            let fetchedUser;
            if (profileUserId) {
                fetchedUser = await userAPI.getUserById(profileUserId);
                setIsOwnProfile(currentUser && String(currentUser.id) === String(profileUserId));
            } else if (currentUser) {
                fetchedUser = await userAPI.getUserById(currentUser.id);
                setIsOwnProfile(true);
            } else {
                navigate('/login');
                return;
            }

            if (!fetchedUser) {
                setUserToDisplay(null);
            } else {
                setUserToDisplay(fetchedUser);
            }
        };

        fetchUserData();
    }, [profileUserId, currentUser, navigate]);

    return { userToDisplay, isOwnProfile };
}

export default useUserProfile;
