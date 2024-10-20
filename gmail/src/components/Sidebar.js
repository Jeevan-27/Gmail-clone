import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FiEdit2, FiInbox, FiStar, FiSend, FiUsers, FiFile, FiTrash2, FiMail } from 'react-icons/fi';
import ComposeMail from './ComposeMail';

const Sidebar = ({ isDarkTheme }) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const navigate = useNavigate();

  const handleCompose = () => {
    setIsComposeOpen(true);
  };

  const handleNavigation = (path) => {
    navigate(`/app/${path}`);
  };

  return (
    <>
      <aside className={`sidebar ${isDarkTheme ? 'dark' : ''}`}>
        <button className="sidebar__composeBtn" onClick={handleCompose}>
          <FiEdit2 className="sidebar__composeIcon" /> Compose
        </button>
        <ul className="sidebar__menu">
          <li onClick={() => handleNavigation('inbox')}><FiInbox /> Inbox</li>
          <li onClick={() => handleNavigation('starred')}><FiStar /> Starred</li>
          <li onClick={() => handleNavigation('sent')}><FiSend /> Sent</li>
          <li onClick={() => handleNavigation('groups')}><FiUsers /> Groups</li>
          <li onClick={() => handleNavigation('drafts')}><FiFile /> Drafts</li>
          <li onClick={() => handleNavigation('bin')}><FiTrash2 /> Bin</li>
          <li onClick={() => handleNavigation('all-mail')}><FiMail /> All Mail</li>
        </ul>
      </aside>
      {isComposeOpen && (
        <ComposeMail open={isComposeOpen} setOpenDrawer={setIsComposeOpen} isDarkTheme={isDarkTheme} />
      )}
    </>
  );
};

export default Sidebar;