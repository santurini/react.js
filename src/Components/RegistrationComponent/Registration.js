import React, { useState, useCallback } from 'react';
import PhoneInput from 'react-phone-number-input';
import  secureLocalStorage  from  "react-secure-storage";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import './Registration.css';

function Registration({ onRegistrationSuccess }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telephoneError, setTelephoneError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [telephoneAvailable, setTelephoneAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // New state for success

  const temporaryToken = secureLocalStorage.getItem('temporaryToken')  

  // Validate password using regex
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-!?_#@.;'^*[\]$%&/()=|]).{8,}$/;
    return passwordRegex.test(password);
  };

  // Validate username length
  const validateUsername = (username) => {
    return username.length >= 3 && username.length <= 20;
  };

  // Handle username availability check
  const checkUsernameAvailability = useCallback(async (username) => {
    if (validateUsername(username)) {
      const payload = { username };
      console.log(`Checking username availability with payload: ${JSON.stringify(payload)}`);

      try {
        const response = await fetch('http://localhost:8080/api/user/checkUsername', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${temporaryToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setUsernameAvailable(true);
          setUsernameError('Username is available.');
        } else if (response.status === 409) {
          setUsernameAvailable(false);
          setUsernameError('Username is already in use.');
        } else {
          const errorData = await response.json();
          console.error('Unexpected error during username check:', errorData);
          setUsernameAvailable(false);
          setUsernameError('Error checking username.');
        }
      } catch (error) {
        console.error('Error during username availability check:', error);
        setUsernameAvailable(false);
        setUsernameError('Error checking username.');
      }
    } else {
      setUsernameAvailable(false);
      setUsernameError('Username must be between 3 and 20 characters.');
    }
  }, [temporaryToken]);

  // Handle email availability check
  const checkEmailAvailability = useCallback(async (email) => {
    const payload = { email };
    console.log(`Checking email availability with payload: ${JSON.stringify(payload)}`);

    try {
      const response = await fetch('http://localhost:8080/api/user/checkEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${temporaryToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEmailAvailable(true);
        setEmailError('Email is available.');
      } else if (response.status === 409) {
        setEmailAvailable(false);
        setEmailError('Email is already in use.');
      } else {
        const errorData = await response.json();
        console.error('Unexpected error during email check:', errorData);
        setEmailAvailable(false);
        setEmailError('Error checking email.');
      }
    } catch (error) {
      console.error('Error during email availability check:', error);
      setEmailAvailable(false);
      setEmailError('Error checking email.');
    }
  }, [temporaryToken]);

  // Handle telephone availability check
  const checkTelephoneAvailability = useCallback(async (telephone) => {
    if (telephone.length > 0) {
      const payload = { telephone };
      console.log(`Checking telephone availability with payload: ${JSON.stringify(payload)}`);

      try {
        const response = await fetch('http://localhost:8080/api/user/checkTelephone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${temporaryToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setTelephoneAvailable(true);
          setTelephoneError('Telephone number is available.');
        } else if (response.status === 409) {
          setTelephoneAvailable(false);
          setTelephoneError('Telephone number is already in use.');
        } else {
          const errorData = await response.json();
          console.error('Unexpected error during telephone check:', errorData);
          setTelephoneAvailable(false);
          setTelephoneError('Error checking telephone.');
        }
      } catch (error) {
        console.error('Error during telephone availability check:', error);
        setTelephoneAvailable(false);
        setTelephoneError('Error checking telephone.');
      }
    }
  }, [temporaryToken]);

  // Handle changes for each input
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (newUsername.length > 0) {
      if (validateUsername(newUsername)) {
        checkUsernameAvailability(newUsername);
      } else {
        setUsernameAvailable(false);
        setUsernameError('Username must be between 3 and 20 characters.');
      }
    } else {
      setUsernameAvailable(true);
      setUsernameError('');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail.length > 0) {
      if (e.target.validity.valid) {
        checkEmailAvailability(newEmail);
      } else {
        setEmailAvailable(false);
        setEmailError('Invalid email format.');
      }
    } else {
      setEmailAvailable(true);
      setEmailError('');
    }
  };

  const handleTelephoneChange = (value) => {
    setTelephone(value || ''); // Ensure value is always a string

    try {
      const phoneNumber = parsePhoneNumberFromString(value);

      if (value.length > 0) {
        if (phoneNumber && phoneNumber.isValid()) {
          checkTelephoneAvailability(phoneNumber.formatInternational());
          setTelephoneError(''); // Clear error if valid
        } else {
          setTelephoneAvailable(false);
          setTelephoneError('Invalid phone number.');
        }
      } else {
        setTelephoneAvailable(true); // Telephone is considered available if it's empty
        setTelephoneError(''); // Clear error if empty
      }
    } catch (error) {
      console.error('Error parsing phone number:', error);
      setTelephoneAvailable(false);
      setTelephoneError('A text for parsing must be a string.');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setPasswordError('');
    setError('');

    // Validate inputs
    if (!validateUsername(username) || !usernameAvailable) {
      setUsernameError('Username must be between 3 and 20 characters and available.');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
      return;
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (!emailAvailable) {
      setEmailError('Email is already in use.');
      return;
    }

    if (!telephoneAvailable) {
      setTelephoneError('Telephone number is already in use.');
      return;
    }

    // Create payload
    const payload = {
      email,
      username,
      password,
      telephone,
      emailVerified: false,
    };

    console.log('Registration payload:', JSON.stringify(payload, null, 2));

    setButtonDisabled(true); // Set loading state to true

    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:8080/api/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${temporaryToken}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Include credentials if required
      });

      if (response.ok) {
        console.log('Registration successful');
        setRegistrationSuccess(true); // Set success state to true
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
      } else {
        const errorData = await response.json();
        console.log('Registration error response:', errorData);
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='registration-container'>
      <div className={`registration-card ${registrationSuccess ? 'success-card' : ''}`}>
        {registrationSuccess ? (
          <div className="success-message request">
            Your request has been sent,<br></br> 
            check your email to complete the registration process!<br></br> 
            😃
          </div>
        ) : (
          <>
            <h2 className="registration-title">Register</h2>
            <form className="registration-form" onSubmit={handleRegistration}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {email.length > 0 && <div className={`error-message ${emailAvailable ? 'success-message' : ''}`}>{emailError}</div>}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
                {username.length > 0 && <div className={`error-message ${usernameAvailable ? 'success-message' : ''}`}>{usernameError}</div>}
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
                {!validatePassword(password) && password.length > 0 && (
                  <div className="error-message">Password is too weak.</div>
                )}
                {passwordError && <div className="error-message">{passwordError}</div>}
              </div>
              <div className="form-group">
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
                {password !== confirmPassword && confirmPassword.length > 0 && (
                  <div className="error-message">Passwords do not match.</div>
                )}
              </div>
              <div className="form-group">
                <PhoneInput
                  international
                  defaultCountry="IT"
                  value={telephone}
                  onChange={handleTelephoneChange}
                  placeholder="Enter phone number"
                />
                {telephone.length > 0 && <div className={`error-message ${telephoneAvailable ? 'success-message' : ''}`}>{telephoneError}</div>}
              </div>
              {error && <p className="error-message">{error}</p>}
              <button
                type="submit"
                className={`btn btn-primary ${buttonDisabled ? 'btn-disabled' : ''}`}
                disabled={buttonDisabled} // Disable button when loading
              >
                {'Register'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Registration;
