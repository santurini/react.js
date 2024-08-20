import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import  secureLocalStorage  from  "react-secure-storage";
import './ProfileCard.css';

const ProfileCard = () => {
  const { user, clearUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteError, setDeleteError] = useState('');

  if (!user) {
    return <div className="profile-card">Loading...</div>;
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-!?_#@.;'^*[\]$%&/()=|]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setError('New password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
      return;
    } else if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/changePassword', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secureLocalStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to change password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== user.email) {
      setDeleteError('Email does not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${secureLocalStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        clearUser();
        setSuccess('Account deleted successfully.');
        setDeleteError('');
        navigate('/');
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || 'Failed to delete account.');
      }
    } catch (error) {
      setDeleteError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile Information</h2>
        <div className="profile-item">
          <label>Username:</label>
          <span>{user.username}</span>
        </div>
        <div className="profile-item">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        <div className="profile-item">
          <label>Telephone:</label>
          <span>{user.telephone}</span>
        </div>

        <div className="change-password-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange} className="change-password-form">
            <div className="form-group">
              <label>Current Password:</label>
              <div className="password-input-container">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <img 
                    src={showCurrentPassword ? "/assets/hide.png" : "/assets/view.png"} 
                    alt={showCurrentPassword ? 'Hide' : 'Show'} 
                  />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <img 
                    src={showNewPassword ? "/assets/hide.png" : "/assets/view.png"} 
                    alt={showNewPassword ? 'Hide' : 'Show'} 
                  />
                </button>
              </div>
              {!validatePassword(newPassword) && newPassword.length > 0 && (
                <div className="error-message">New password is too weak.</div>
              )}
            </div>
            <div className="form-group">
              <label>Confirm New Password:</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img 
                    src={showConfirmPassword ? "/assets/hide.png" : "/assets/view.png"} 
                    alt={showConfirmPassword ? 'Hide' : 'Show'} 
                  />
                </button>
              </div>
              {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                <div className="error-message">Passwords do not match.</div>
              )}
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" className="btn-change-password">Change Password</button>
          </form>
        </div>

        <div className="delete-account-section">
          {!showDeleteConfirmation ? (
            <button
              className="btn-delete-account"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirmation-card">
              <p>Type your email to delete the account:</p>
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {deleteError && <div className="error-message delete">{deleteError}</div>}
              <div className="delete-buttons">
                <button
                  className="btn-go-back"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Go Back
                </button>
                <button
                  className="btn-confirm-delete"
                  onClick={handleDeleteAccount}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
