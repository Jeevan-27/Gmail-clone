import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import './DraftsList.css';

const DraftsList = ({ loggedInUserEmail }) => {
    const [drafts, setDrafts] = useState([]);
    const [selectedDraft, setSelectedDraft] = useState(null);

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get('http://localhost:1973/api/drafts', {
                    params: { email: user.email },
                });
                setDrafts(response.data);
            } catch (error) {
                console.error('Error fetching drafts:', error);
            }
        };

        fetchDrafts();
    }, [loggedInUserEmail]);

    const handleDraftClick = (draft) => {
        setSelectedDraft(draft);
    };

    const handleClose = () => {
        setSelectedDraft(null); // Close the tray
    };

    return (
        <Box className="drafts-list-container">
            <Typography variant="h5" style={{fontWeight:"bold", textAlign:"center"}}>Drafts</Typography>
            <ul>
                {drafts.map((draft) => (
                    <li key={draft._id} onClick={() => handleDraftClick(draft)} className="draft-item">
                        <span className="draft-subject">{draft.subject}</span> - <span className="draft-from">{draft.from}</span>
                    </li>
                ))}
            </ul>

            {/* Bottom Tray for showing the draft details */}
            {selectedDraft && (
                <div className="draft-tray">
                    <div className="draft-tray-content">
                        <button className="close-btn" onClick={handleClose}>✖</button>
                        <Typography variant="h5" style={{fontWeight:"bold", textAlign:"center"}}>{selectedDraft.subject}</Typography>
                        <Typography variant="body1"><strong>From:</strong> {selectedDraft.from}</Typography>
                        <Typography variant="body1"><strong>To:</strong> {selectedDraft.to}</Typography>
                        <Typography variant="body1"><strong>Date:</strong> {new Date(selectedDraft.date).toLocaleString()}</Typography>
                        <Typography variant="body1"><strong>Body:</strong></Typography>
                        <div dangerouslySetInnerHTML={{ __html: selectedDraft.body }} /> {/* Render HTML safely */}
                        {/* Attachments can be displayed similarly */}
                        {selectedDraft.attachments && selectedDraft.attachments.length > 0 && (
                            <div>
                                <strong>Attachments:</strong>
                                <ul>
                                    {selectedDraft.attachments.map((attachment, index) => (
                                        <li key={index}>{attachment}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Box>
    );
};

export default DraftsList;
