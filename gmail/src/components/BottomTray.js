// import React from 'react';
// import './BottomTray.css';

// const BottomTray = ({ email, onClose }) => {
//   return (
//     <div className="bottom-tray">
//       <div className="bottom-tray-content">
//         <h4>{email.subject}</h4>
//         <p><strong>From:</strong> {Array.isArray(email.to) ? email.to.join(', ') : email.to}</p>
//         <p>{email.body}</p>
//       </div>
//       <button className="bottom-tray-close" onClick={onClose}>x</button>
//     </div>
//   );
// };

// export default BottomTray;


import React from 'react';
import './BottomTray.css';

const BottomTray = ({ email, onClose }) => {
  return (
    <div className="bottom-tray">
      <div className="bottom-tray-content">
        <h4>Subject: {email.subject}</h4>
        <p><strong>From:</strong> {email.from}</p>
        <p><strong>To:</strong> {Array.isArray(email.to) ? email.to.join(', ') : email.to}</p>
        <p><strong>Body:</strong></p>
        <div className="email-body">
          {email.body}
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="attachments-section">
            <p><strong>Attachments:</strong></p>
            <ul className="attachments-list">
              {email.attachments.map((attachment, index) => (
                <li key={index}>
                  <a href={attachment.url} download={attachment.name}>
                    {attachment.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button className="bottom-tray-close" onClick={onClose}>x</button>
    </div>
  );
};

export default BottomTray;