import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import  secureLocalStorage  from  "react-secure-storage";
import './Login.css';

function Login() {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { fetchUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const temporaryToken = secureLocalStorage.getItem('temporaryToken')  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset the error state before making the request
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${temporaryToken}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        secureLocalStorage.setItem('token', data.token);
        await fetchUserData(data.token);
        navigate('/');
      } else {
        // Handle different error status codes
        if (response.status === 404) {
          setError('Username not found');
        } else if (response.status === 401) {
          setError('Password is incorrect');
        } else if (response.status === 403) {
          setError('Email not verified');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'An unexpected error occurred. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleRegister = async () => {
    setError(''); // Reset error state before making the request
    try {
      const response = await fetch('http://localhost:8080/api/auth/generateTemporaryToken', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const temporaryToken = data.token;

        secureLocalStorage.setItem('temporaryToken', temporaryToken);
        navigate('/registration');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate temporary token.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='login-container'>
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img 
                      src={showPassword ? "/assets/hide.png" : "/assets/view.png"} 
                      alt={showPassword ? 'Hide' : 'Show'} 
                    />
                  </button>
            </div>
          </div>
          <div className="form-check-forgot">
            <div className="form-check">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-check-input"
              />
              <label htmlFor="remember-me" className="form-check-label">Remember Me</label>
            </div>
            <button type="button" className="forgot-password-btn">Forgot Password?</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-container">
            <button type="submit" className="btn btn-login">Sign In</button>
            <button type="button" className="btn btn-register" onClick={handleRegister}>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;