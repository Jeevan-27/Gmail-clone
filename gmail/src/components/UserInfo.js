import React from 'react';
import './UserInfo.css';


const UserInfo = ({ username, email, onLogout, isVisible, isDarkTheme }) => {
  return (
    <div className={`user-info ${isVisible ? 'visible' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}>
      <div className="user-info__container">
        <div className="user-info__username">{username}</div>
        <div className="user-info__email">{email}</div>
        <hr className="user-info__divider" />
        <div className="user-info__logout" onClick={onLogout}>Logout</div>
      </div>
    </div>
  );
};

export default UserInfo;