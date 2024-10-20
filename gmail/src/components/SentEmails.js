import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainContent.css';

const SentEmails = () => {
    const [sentEmails, setSentEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        const fetchSentEmails = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const userEmail = user.email;

            try {
                const response = await axios.get(`http://localhost:1973/api/sent`, {
                    params: { email: userEmail },
                });
                setSentEmails(response.data);
            } catch (error) {
                console.error('Error fetching sent emails:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSentEmails();
    }, []);

    const handleEmailClick = (email) => {
        setSelectedEmail(email);
    };

    const handleClose = () => {
        setSelectedEmail(null); 
    };

    if (loading) {
        return <div>Loading sent emails...</div>;
    }

    return (
        <div className="main-content-container">
            <div className="inbox-list">
                <h2>Sent Emails</h2>
                <ul>
                    {sentEmails.map((email) => (
                        <li key={email._id} onClick={() => handleEmailClick(email)} className="email-item">
                            <span className="email-to">{email.to}</span> -{' '}
                            <span className="email-subject">{email.subject}</span>
                            <span className="email-date">{new Date(email.date).toLocaleString()}</span>
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

export default SentEmails;