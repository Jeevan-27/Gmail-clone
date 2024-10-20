const express = require('express');
const router = express.Router();
const Email = require('../models/Email'); 

// Get sent emails for a specific user
router.get('/', async (req, res) => {
    const { email } = req.query;

    try {
        const sentEmails = await Email.find({ from: email });
        res.json(sentEmails);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;