import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LoginRegister from './components/LoginRegister';
import './App.css';
import ComposeMail from './components/ComposeMail.js';
import Groups from './components/Groups';
import Inbox from './components/Inbox';
import StarredEmails from './components/StarredEmails';
import BinEmails from './components/BinEmails';
import DraftsList from './components/DraftsList';
import SentEmails from './components/SentEmails';
import AllMails from './components/AllMails';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem('isDarkTheme') === 'true' ? true : false;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('isDarkTheme', newTheme);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('user');
  };

  const AppLayout = () => (
    <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
      <Header toggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} />
      <div className="app__body">
        {isSidebarOpen && <Sidebar isDarkTheme={isDarkTheme} />}
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route
          path="/app"
          element={isAuthenticated() ? <AppLayout /> : <Navigate to="/login" />}
        >
          <Route path="inbox" element={<Inbox />} />
          <Route path="starred" element={<StarredEmails/>} />
          <Route path="sent" element={<SentEmails/>} />
          <Route path="groups" element={<Groups isDarkTheme={isDarkTheme} />} />
          <Route path="drafts" element={<DraftsList/>} />
          <Route path="bin" element={<BinEmails/>} />
          <Route path="all-mail" element={<AllMails/>} />
        </Route>
        <Route path="/compose" element={isComposeOpen && <ComposeMail open={isComposeOpen} setOpenDrawer={setIsComposeOpen} isDarkTheme={isDarkTheme}/>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;