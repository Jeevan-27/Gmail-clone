const express = require('express');
const router = express.Router();
const Inbox = require('../models/Email');  // Ensure this model is correct
const Draft = require('../models/Drafts'); // Ensure this model is correct

// Search emails based on query and user email
router.get('/', async (req, res) => {
  const { email, query } = req.query;

  try {
    const inboxEmails = await Inbox.find({
      $or: [
        { to: email, subject: { $regex: query, $options: 'i' }, bin: false },
        // { from: email, subject: { $regex: query, $options: 'i' }, binSend: false },
        { from: email, subject: { $regex: query, $options: 'i' } },
      ],
    });

    const draftEmails = await Draft.find({
      from: email,
      subject: { $regex: query, $options: 'i' },
    });

    const allEmails = [...inboxEmails, ...draftEmails];

    res.json(allEmails);
  } catch (err) {
    console.error('Error searching emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;