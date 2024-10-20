import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginRegister.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isLogin ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLogin]);

  const isOver18 = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate())));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const password = e.target.password.value;
    const confirmPassword = isLogin ? null : e.target.confirmPassword?.value;

    if (!isLogin && !isOver18(dob)) {
      setError('You must be over 18 years old.');
      setLoading(false);
      return;
    }

    if (!isLogin && email === recoveryEmail) {
      setError('Email and recovery email cannot be the same.');
      setLoading(false);
      return;
    }

    if (!isLogin && (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber))) {
      setError('Mobile number must be 10 digits.');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:1973/api/auth/login', {
          emailId: email,
          password: password,
        });

        console.log('Login response:', response.data); // Debugging log

        localStorage.setItem('token', response.data.token); 

        localStorage.setItem('user', JSON.stringify({
          username: response.data.user.username,
          email: response.data.user.emailId,
        }));

        navigate('/app/inbox');
      } else {
        const fullName = e.target.fullName.value;
        await axios.post('http://localhost:1973/api/auth/register', {
          username: fullName,
          emailId: email,
          password: password,
          dob: dob,
          recoveryEmail: recoveryEmail,
          phoneNumber: phoneNumber,
        });
        
        setIsLogin(true); // Switch to login mode after registration
      }
    } catch (error) {
      console.error('Login/Register error:', error.response || error.message); // Improved error logging
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    if (value.includes('@hedwig.com')) {
      setEmail(value.split('@')[0] + '@hedwig.com');
    } else if (value.endsWith('@')) {
      setEmail(`${value}hedwig.com`);
    } else {
      setEmail(value);
    }
  };

  const handleRecoveryEmailChange = (e) => {
    const value = e.target.value;

    if (value.endsWith('@') && !value.includes('@hedwig.com')) {
      setRecoveryEmail(`${value}hedwig.com`);
    } else {
      setRecoveryEmail(value);
    }
  };

  return (
    <div className="login-register-container">
      <div className="form-wrapper">
        <h2>{isLogin ? 'Login to Your Account' : 'Create a New Account'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <>
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required />

              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />

              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
              />

              <label htmlFor="recoveryEmail">Recovery Email</label>
              <input
                type="email"
                id="recoveryEmail"
                name="recoveryEmail"
                placeholder="Enter recovery email"
                value={recoveryEmail}
                onChange={handleRecoveryEmailChange}
                required
              />

              <label htmlFor="phoneNumber">Recovery Mobile Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </>
          )}

          {isLogin && (
            <>
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />

              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required />
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="toggle-message">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;