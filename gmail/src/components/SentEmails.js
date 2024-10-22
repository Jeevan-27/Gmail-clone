// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './MainContent.css';

// const SentEmails = () => {
//     const [sentEmails, setSentEmails] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEmail, setSelectedEmail] = useState(null);

//     useEffect(() => {
//         const fetchSentEmails = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             const userEmail = user.email;

//             try {
//                 const response = await axios.get(`http://localhost:1973/api/sent`, {
//                     params: { email: userEmail },
//                 });
//                 setSentEmails(response.data);
//             } catch (error) {
//                 console.error('Error fetching sent emails:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSentEmails();
//     }, []);

//     const handleEmailClick = (email) => {
//         setSelectedEmail(email);
//     };

//     const handleClose = () => {
//         setSelectedEmail(null); 
//     };

//     // if (loading) {
//     //     return <div>Loading sent emails...</div>;
//     // }

//     return (
//         <div className="main-content-container">
//             <div className="inbox-list">
//                 <h2>Sent Emails</h2>
//                 <ul>
//                     {sentEmails.map((email) => (
//                         <li key={email._id} onClick={() => handleEmailClick(email)} className="email-item">
//                             <span className="email-to">{email.to}</span> -{' '}
//                             <span className="email-subject">{email.subject}</span>
//                             <span className="email-date">{new Date(email.date).toLocaleString()}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Bottom Tray for showing the email details */}
//             {selectedEmail && (
//                 <div className="email-tray">
//                     <div className="email-tray-content">
//                         <button className="close-btn" onClick={handleClose}>✖</button>
//                         <h2>{selectedEmail.subject}</h2>
//                         <p><strong>From:</strong> {selectedEmail.from}</p>
//                         <p><strong>To:</strong> {selectedEmail.to}</p>
//                         <p><strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}</p>
//                         <p><strong>Body:</strong> {selectedEmail.body}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SentEmails;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainContent.css';

const SentEmails = () => {
    const [sentEmails, setSentEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [isForwarding, setIsForwarding] = useState(false);

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
        setIsForwarding(false);
        setRecipientEmail(''); // Clear recipient email when closing
    };

    const handleMoveToBin = async (emailId) => {
        try {
            await axios.put(`http://localhost:1973/api/sent/${emailId}/bin`, { bin: true });
            // After moving to bin, remove the email from the sent emails list
            setSentEmails(prevEmails => prevEmails.filter(email => email._id !== emailId));
            setSelectedEmail(null); // Close the tray after moving to bin
        } catch (error) {
            console.error('Error moving email to bin:', error);
        }
    };

    const handleForward = () => {
        setIsForwarding(true); // Set forwarding state to true
    };

    const handleSendForward = async () => {
        if (!recipientEmail) {
            alert("Please enter a recipient email.");
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const forwardedEmail = {
            from: user.email,
            to: recipientEmail,
            subject: `${selectedEmail.subject} (Forwarded)`,
            body: selectedEmail.body,
            attachments: selectedEmail.attachments || [], // Include attachments if any
            date: new Date(),
        };

        try {
            await axios.post('http://localhost:1973/api/inbox', forwardedEmail);
            alert("Email forwarded successfully!");
            handleClose(); // Close the tray after forwarding
        } catch (error) {
            console.error('Error forwarding email:', error);
            alert("Error forwarding email. Please try again.");
        }
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
                        <p><strong>Content:</strong> {selectedEmail.body}</p>

                        {/* Move to Bin Button */}
                        <button
                            className="bin-btn"
                            onClick={() => handleMoveToBin(selectedEmail._id)}
                        >
                            Move to Bin
                        </button>

                        {/* Forward Button */}
                        <button onClick={handleForward}>Forward</button>

                        {/* Forwarding Input */}
                        {isForwarding && (
                            <div className="forward-input">
                                <input
                                    type="email"
                                    placeholder="Recipient email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                />
                                <button onClick={handleSendForward}>Send</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SentEmails;