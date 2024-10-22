// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './MainContent.css'; 

// const BinEmails = () => {
//   const [binEmails, setBinEmails] = useState([]);
//   const [selectedBinEmail, setSelectedBinEmail] = useState(null);

//   useEffect(() => {
//     const fetchBinEmails = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         const response = await axios.get('http://localhost:1973/api/binEmails', {
//           params: { email: user.email },
//         });
//         setBinEmails(response.data);
//       } catch (error) {
//         console.error('Error fetching bin emails:', error);
//       }
//     };

//     fetchBinEmails();
//   }, []);

//   const handleBinEmailClick = (email) => {
//     setSelectedBinEmail(email); // Show the clicked bin email in the tray
//   };

//   const handleClose = () => {
//     setSelectedBinEmail(null); // Close the tray
//   };

//   const handleRestore = async (emailId) => {
//     try {
//       await axios.put(`http://localhost:1973/api/binEmails/${emailId}/restore`, { bin: false });
//       // After restoring, remove the email from the bin emails list
//       setBinEmails((prevEmails) => prevEmails.filter(email => email._id !== emailId));
//       setSelectedBinEmail(null); // Close the tray after restoring
//     } catch (error) {
//       console.error('Error restoring email:', error);
//     }
//   };

//   return (
//     <div className="main-content-container">
//       <div className="inbox-list">  {/* Reusing inbox styles for bin list */}
//         <h2>Bin</h2>
//         <ul>
//           {binEmails.map((email) => (
//             <li
//               key={email._id}
//               onClick={() => handleBinEmailClick(email)}
//               className="email-item"
//             >
//               <span className="email-subject">{email.subject}</span> -{' '}
//               <span className="email-from">{email.from}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Bottom Tray for showing the bin email details */}
//       {selectedBinEmail && (
//         <div className="email-tray">
//           <div className="email-tray-content">
//             <button className="close-btn" onClick={handleClose}>✖</button>
//             <h2>{selectedBinEmail.subject}</h2>
//             <p><strong>From:</strong> {selectedBinEmail.from}</p>
//             <p><strong>To:</strong> {selectedBinEmail.to}</p>
//             <p><strong>Date:</strong> {new Date(selectedBinEmail.date).toLocaleString()}</p>
//             <p><strong>Body:</strong> {selectedBinEmail.body}</p>

//             {/* Restore Button */}
//             <button
//               className="restore-btn"
//               onClick={() => handleRestore(selectedBinEmail._id)}
//             >
//               Restore Email
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BinEmails;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css'; 

const BinEmails = () => {
  const [binEmails, setBinEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
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
      const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
      await axios.put(`http://localhost:1973/api/binEmails/${emailId}/restore`, { userEmail: user.email });
      setBinEmails((prevEmails) => prevEmails.filter(email => email._id !== emailId));
      setSelectedBinEmail(null);
    } catch (error) {
      console.error('Error restoring email:', error);
    }
  };

  const handleDeletePermanently = async (emailId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
      await axios.delete(`http://localhost:1973/api/binEmails/${emailId}`, { data: { userEmail: user.email } });
      setBinEmails((prevEmails) => prevEmails.filter(email => email._id !== emailId));
      setSelectedBinEmail(null);
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  // Handle selecting an individual email
  const handleSelectEmail = (emailId) => {
    setSelectedEmails((prevSelected) =>
      prevSelected.includes(emailId)
        ? prevSelected.filter((id) => id !== emailId)
        : [...prevSelected, emailId]
    );
  };

  // Handle selecting all emails
  const handleSelectAllEmails = () => {
    if (selectAll) {
      setSelectedEmails([]); // Deselect all
    } else {
      setSelectedEmails(binEmails.map((email) => email._id)); // Select all
    }
    setSelectAll(!selectAll); // Toggle select all state
  };

  // Handle deleting selected emails
  const handleDeleteSelectedEmails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
      await Promise.all(
        selectedEmails.map((emailId) => 
          axios.delete(`http://localhost:1973/api/binEmails/${emailId}`, { data: { userEmail: user.email } })
        )
      );
      setBinEmails((prevEmails) => prevEmails.filter((email) => !selectedEmails.includes(email._id)));
      setSelectedEmails([]); // Clear selected emails
      setSelectAll(false); // Uncheck "Select All"
    } catch (error) {
      console.error('Error deleting selected emails:', error);
    }
  };

  return (
    <div className="main-content-container">
      <div className="inbox-list">
        <h2>Bin</h2>

        {/* Select All Checkbox */}
        <div className="select-all-container">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllEmails}
          />
          <label>Select All</label>
        </div>

        {/* Emails List */}
        <ul>
          {binEmails.map((email) => (
            <li key={email._id} className="email-item">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email._id)}
                onChange={() => handleSelectEmail(email._id)}
              />
              <span
                className="email-subject"
                onClick={() => handleBinEmailClick(email)}
              >
                {email.subject}
              </span> -{' '}
              <span className="email-from">{email.from}</span>
            </li>
          ))}
        </ul>

        {/* Delete Selected Button */}
        {selectedEmails.length > 0 && (
          <button className="delete-selected-btn" onClick={handleDeleteSelectedEmails}>
            Delete Selected Permanently
          </button>
        )}
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
            <p><strong>Content:</strong> {selectedBinEmail.body}</p>

            <div className="email-actions">
              <button onClick={() => handleRestore(selectedBinEmail._id)}>Restore</button>
              <button onClick={() => handleDeletePermanently(selectedBinEmail._id)}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BinEmails;