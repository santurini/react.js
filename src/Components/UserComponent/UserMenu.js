// UserMenu.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext'; // Import AuthContext
import './UserMenu.css';

const UserMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const { clearUser } = useContext(AuthContext);

  const handleProfileClick = () => {
    navigate('/profile');
    onClose()
  };

  const handleLogout = () => {
    clearUser()
    navigate('/');
    onClose()
  };

  return (
    <div className="user-menu">
      <div className="menu-item" onClick={handleProfileClick}>Profile</div>
      <div className="menu-item logout-item" onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default UserMenu;
