const express = require('express');
const router = express.Router();
const Inbox = require('../models/Email'); 
const Draft = require('../models/Drafts'); 

// Get all emails for a specific user from Inbox and Drafts
router.get('/', async (req, res) => {
  const { email } = req.query;

  try {
    const inboxEmails = await Inbox.find({ to: email });
    const draftEmails = await Draft.find({ from: email });

    // Combine all the emails into one array
    const allEmails = [...inboxEmails, ...draftEmails];

    res.json(allEmails);
  } catch (err) {
    console.error('Error fetching all emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;