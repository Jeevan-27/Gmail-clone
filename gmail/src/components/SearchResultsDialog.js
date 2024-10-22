import React from 'react';
import './SearchResultsDialog.css';

const SearchResultsDialog = ({ isOpen, searchResults, onEmailClick, onClose }) => {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="search-dialog-backdrop" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}> {/* Prevent click on content from closing */}
        <div className="search-dialog-header">
          <h4>Search Results</h4>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="search-dialog-body">
          {searchResults.length > 0 ? (
            <ul className="search-dialog-list">
              {searchResults.map((email) => (
                <li key={email._id} onClick={() => onEmailClick(email)}>
                  <span className="email-subject">{email.subject}</span> -{' '}
                  <span className="email-from">
                    {Array.isArray(email.to) ? email.to.join(', ') : email.to}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching emails found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsDialog;