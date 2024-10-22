// routes/allMails.js
const express = require('express');
const router = express.Router();
const Inbox = require('../models/Email');  // Ensure this model is correct
const Draft = require('../models/Drafts'); // Ensure this model is correct

// Get all emails for a specific user from Inbox and Drafts
router.get('/', async (req, res) => {
  const { email } = req.query;

  try {
    const inboxEmails = await Inbox.find({ to: email , bin:false});
    const draftEmails = await Draft.find({ from: email });
    const sentEmails = await Inbox.find({ from: email, binSend:false });

    // Combine all the emails into one array
    const allEmails = [...inboxEmails, ...draftEmails, ...sentEmails];

    res.json(allEmails);
  } catch (err) {
    console.error('Error fetching all emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;