const express = require('express');
const router = express.Router();
const Email = require('../models/Email');

// Restore email from bin (set bin to false)
router.put('/:id/restore', async (req, res) => {
  try {
    const emailId = req.params.id;
    // Update the email's bin field to false
    await Email.findByIdAndUpdate(emailId, { bin: false });
    res.status(200).send('Email restored successfully');
  } catch (error) {
    console.error('Error restoring email:', error);
    res.status(500).send('Error restoring email');
  }
});

// Get bin emails for a specific user
router.get('/', async (req, res) => {
  const { email } = req.query;

  try {
    // Fetch all bin emails for the logged-in user
    const binEmails = await Email.find({ to: email, bin: true });
    res.json(binEmails);
  } catch (err) {
    console.error('Error fetching bin emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
