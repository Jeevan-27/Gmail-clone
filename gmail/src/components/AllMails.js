import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css';

const AllMails = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchAllMails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:1973/api/allMails', {
          params: { email: user.email },
        });
        setEmails(response.data);
      } catch (error) {
        console.error('Error fetching all mails:', error);
      }
    };

    fetchAllMails();
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleClose = () => {
    setSelectedEmail(null); // Close the tray
  };

  return (
    <div className="main-content-container">
      <div className="inbox-list">
        <h2>All Mail</h2>
        <ul>
          {emails.map((email) => (
            <li key={email._id} onClick={() => handleEmailClick(email)} className="email-item">
              <span className="email-subject">{email.subject}</span> -{' '}
              <span className="email-from">{email.from}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Tray for showing the email details */}
      {selectedEmail && (
        <div className="email-tray">
          <div className="email-tray-content">
            <button className="close-btn" onClick={handleClose}>✖</button>
            <h2>{selectedEmail.subject}</h2>
            <p><strong>From:</strong> {selectedEmail.from}</p>
            <p><strong>To:</strong> {selectedEmail.to}</p>
            <p><strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}</p>
            <p><strong>Body:</strong> {selectedEmail.body}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMails;