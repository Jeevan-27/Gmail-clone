import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ isVisible, onToggleTheme, isDarkTheme }) => {
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      // Parse the user object from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
  
      if (!user || !user.email) {
        alert('User information not found in local storage');
        return;
      }
  
      const response = await fetch('http://localhost:1973/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailId: user.email, // Access emailId after parsing
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Reset fields after successful password change
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setChangePasswordModalVisible(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Error changing password');
    }
  };    

  if (!isVisible) return null;

  const themeClass = isDarkTheme ? 'dark-theme' : '';

  return (
    <div className={`settings ${themeClass}`}>
      <div className="settings-options">
        <button 
          className="settings-button"
          onClick={() => setChangePasswordModalVisible(true)}
        >
          Change Password
        </button>
        <button 
          className="settings-button"
          onClick={onToggleTheme}
        >
          Switch Theme
        </button>
      </div>

      {isChangePasswordModalVisible && (
        <div className={`modal-overlay ${themeClass}`}>
          <div className="modal-content">
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="old-password">Old Password</label>
                <input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setChangePasswordModalVisible(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;