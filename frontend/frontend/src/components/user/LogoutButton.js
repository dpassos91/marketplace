// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
