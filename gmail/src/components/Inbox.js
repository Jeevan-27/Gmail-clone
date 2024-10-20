import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:1973/api/inbox', {
          params: { email: user.email },
        });
        setEmails(response.data);
      } catch (error) {
        console.error('Error fetching inbox:', error);
      }
    };

    fetchInbox();
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleClose = () => {
    setSelectedEmail(null); // Close the tray
  };

  const toggleStarred = async (emailId, isStarred) => {
    try {
      await axios.put(`http://localhost:1973/api/inbox/${emailId}/star`, { starred: !isStarred });
      // Update the UI after successfully starring/un-starring
      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, starred: !isStarred } : email
        )
      );
      if (selectedEmail && selectedEmail._id === emailId) {
        setSelectedEmail((prevSelectedEmail) => ({
          ...prevSelectedEmail,
          starred: !isStarred,
        }));
      }
    } catch (error) {
      console.error('Error updating starred status:', error);
    }
  };

  const handleDelete = async (emailId) => {
    try {
      await axios.put(`http://localhost:1973/api/inbox/${emailId}/delete`, { bin: true });
      // Remove the deleted email from the UI
      setEmails((prevEmails) => prevEmails.filter(email => email._id !== emailId));
      if (selectedEmail && selectedEmail._id === emailId) {
        setSelectedEmail(null); // Close the tray if the deleted email was open
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div className="main-content-container">
      <div className="inbox-list">
        <h2>Inbox</h2>
        <ul>
          {emails.map((email) => (
            <li key={email._id} onClick={() => handleEmailClick(email)} className="email-item">
              <span className="email-subject">{email.subject}</span> -{' '}
              <span className="email-from">{email.from}</span>
              {/* Star Button */}
              <button
                className={`star-btn ${email.starred ? 'starred' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the email when starring
                  toggleStarred(email._id, email.starred);
                }}
              >
                {email.starred ? '★' : '☆'}
              </button>
              {/* Delete Button */}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the email when deleting
                  handleDelete(email._id);
                }}
              >
                🗑️
              </button>
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
            <p><strong>Starred:</strong> {selectedEmail.starred ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;