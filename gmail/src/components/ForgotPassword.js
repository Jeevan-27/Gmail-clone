import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import './ForgotPassword.css'; // Ensure to add your CSS styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Hook for navigation

  // Fetch recovery email from the database
  const fetchRecoveryEmail = async (emailId) => {
    try {
      const response = await axios.get(`http://localhost:1973/api/fp/${emailId}`);
      setRecoveryEmail(response.data.recoveryEmail);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch recovery email. Please try again.');
    }
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      fetchRecoveryEmail(value);
    } else {
      setRecoveryEmail('');
    }
  };

  // Send OTP to user's email and recovery email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message before sending OTP
    setError('');   // Reset error before sending OTP
    try {
      const response = await axios.post('http://localhost:1973/api/fp/send-otp', {
        emailId: email,
        recoveryEmail: recoveryEmail,
        otp: Math.floor(100000 + Math.random() * 900000).toString() // Generate OTP
      });
      setMessage(response.data.message);
      setOtpSent(true);
      // Clear error only after successful response
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Verify the OTP entered by user
  const handleVerifyOtp = async () => {
    setMessage(''); // Reset message before verifying OTP
    try {
      const response = await axios.post('http://localhost:1973/api/fp/verify-otp', {
        emailId: email,
        otp: otp,
      });
      setMessage(response.data.message);
      setOtpVerified(true);
      // Clear error only after successful response
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed.');
    }
  };

  // Submit new password after OTP is verified
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message before resetting password

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:1973/api/fp/reset-password', {
        emailId: email,
        newPassword: newPassword,
      });
      setMessage(response.data.message);
      // Clear error only after successful response
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="form-wrapper">
        <h2>Forgot Password</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="form">
            <label htmlFor="email">Enter your email address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="recoveryEmail">Recovery Email:</label>
            <input
              type="email"
              id="recoveryEmail"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Enter your recovery email"
              required
            />

            <button type="submit" className="submit-btn">Send OTP</button>
            <center><Link to="/login" className="back-link">Back to Login</Link></center>
          </form>
        ) : !otpVerified ? (
          <>
            <label htmlFor="otp">Enter OTP sent to your email:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <br></br>
            <center>
            <button onClick={handleVerifyOtp} className="submit-btn">Verify OTP</button>
            </center>
            <br></br>
            <center>
            <Link to="/login" className="back-link">Back to Login</Link>
            </center>
          </>
        ) : (
          <form onSubmit={handleSubmitNewPassword} className="form">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />

            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />

            <button type="submit" className="submit-btn">Reset Password</button>
            <br></br>
            <center><Link to="/login" className="back-link">Back to Login</Link></center>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;