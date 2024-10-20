import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css'; 

const BinEmails = () => {
  const [binEmails, setBinEmails] = useState([]);
  const [selectedBinEmail, setSelectedBinEmail] = useState(null);

  useEffect(() => {
    const fetchBinEmails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:1973/api/binEmails', {
          params: { email: user.email },
        });
        setBinEmails(response.data);
      } catch (error) {
        console.error('Error fetching bin emails:', error);
      }
    };

    fetchBinEmails();
  }, []);

  const handleBinEmailClick = (email) => {
    setSelectedBinEmail(email); // Show the clicked bin email in the tray
  };

  const handleClose = () => {
    setSelectedBinEmail(null); // Close the tray
  };

  const handleRestore = async (emailId) => {
    try {
      await axios.put(`http://localhost:1973/api/binEmails/${emailId}/restore`, { bin: false });
      // After restoring, remove the email from the bin emails list
      setBinEmails((prevEmails) => prevEmails.filter(email => email._id !== emailId));
      setSelectedBinEmail(null); // Close the tray after restoring
    } catch (error) {
      console.error('Error restoring email:', error);
    }
  };

  return (
    <div className="main-content-container">
      <div className="inbox-list">  {/* Reusing inbox styles for bin list */}
        <h2>Bin</h2>
        <ul>
          {binEmails.map((email) => (
            <li
              key={email._id}
              onClick={() => handleBinEmailClick(email)}
              className="email-item"
            >
              <span className="email-subject">{email.subject}</span> -{' '}
              <span className="email-from">{email.from}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Tray for showing the bin email details */}
      {selectedBinEmail && (
        <div className="email-tray">
          <div className="email-tray-content">
            <button className="close-btn" onClick={handleClose}>✖</button>
            <h2>{selectedBinEmail.subject}</h2>
            <p><strong>From:</strong> {selectedBinEmail.from}</p>
            <p><strong>To:</strong> {selectedBinEmail.to}</p>
            <p><strong>Date:</strong> {new Date(selectedBinEmail.date).toLocaleString()}</p>
            <p><strong>Body:</strong> {selectedBinEmail.body}</p>

            {/* Restore Button */}
            <button
              className="restore-btn"
              onClick={() => handleRestore(selectedBinEmail._id)}
            >
              Restore Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BinEmails;
