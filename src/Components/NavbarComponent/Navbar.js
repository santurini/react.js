import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext'; // Import AuthContext
import  secureLocalStorage  from  "react-secure-storage";
import './Navbar.css';
import UserMenu from '../UserComponent/UserMenu'; // Import UserMenu component

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle user menu
  const navigate = useNavigate();
  const menuRef = useRef(null); // Ref for the user menu

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleTabClick = () => {
    const token = secureLocalStorage.getItem('token');
    if (token) {
      navigate('/asta');
    } else {
      navigate('/login');
    }
  };

  // Wrap closeMenu in useCallback to ensure its reference stays stable
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Wrap handleClickOutside in useCallback to avoid re-creation on every render
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeMenu();
    }
  }, [closeMenu]);

  // Add event listener for clicks outside the menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]); // Include handleClickOutside in the dependency array

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        <img src="/assets/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="navbar-tabs">
        <span className="tab" onClick={handleTabClick}>Asta</span>
      </div>
      <div className="navbar-login">
        {user ? (
          <div className="user-menu-container">
            <span className="welcome-message">Welcome, {user.username}!</span>
            <div className="user-icon" onClick={() => setIsMenuOpen(prev => !prev)}>
              <img src="/assets/user.png" alt="User Icon" />
            </div>
            {isMenuOpen && (
              <div ref={menuRef}>
                <UserMenu onClose={closeMenu} />
              </div>
            )}
          </div>
        ) : (
          <button 
            className="btn-login"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
