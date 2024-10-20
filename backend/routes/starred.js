const express = require('express');
const Email = require('../models/Email');

const router = express.Router();

// Get starred emails for a specific user
router.get('/', async (req, res) => {
  const { email } = req.query;  

  try {
    // Fetch all starred emails for the logged-in user
    const starredEmails = await Email.find({ to: email, starred: true });
    res.json(starredEmails);
  } catch (err) {
    console.error('Error fetching starred emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
