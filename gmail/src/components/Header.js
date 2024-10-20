import React, { useState, useEffect } from 'react';
import { FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import UserInfo from './UserInfo';
import Settings from './Settings'; 
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, onToggleTheme }) => {
  const [isUserInfoVisible, setUserInfoVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [user, setUser] = useState({ username: '', email: '' });

  const navigate = useNavigate();

  // Fetch the user info from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleUserClick = () => {
    setUserInfoVisible(!isUserInfoVisible);
  };

  const handleSettingsClick = () => {
    setSettingsVisible(!isSettingsVisible);
    setUserInfoVisible(false); 
  };

  const handleLogout = () => {
    // Clear user info from localStorage on logout
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__left">
        <FiMenu className="header__menuIcon" onClick={toggleSidebar} />
        <img
          src={require('../assets/Logo-removebg3.png')}
          alt="Smail"
          className="header__logo"
        />
      </div>
      <div className="header__center">
        <input type="text" placeholder="Search mail" className="header__search" />
      </div>
      <div className="header__right">
        <FiSettings className="header__icon" onClick={handleSettingsClick} />
        <FiUser className="header__icon" onClick={handleUserClick} />
        <UserInfo
          username={user.username} 
          email={user.email} 
          onLogout={handleLogout}
          isVisible={isUserInfoVisible}
        />
        <Settings isVisible={isSettingsVisible} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
};

export default Header;