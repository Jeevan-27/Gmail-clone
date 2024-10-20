const express = require('express');
const router = express.Router();
const Email = require('../models/Email'); // Make sure this path is correct

// POST route to handle sending emails
router.post('/', async (req, res) => {
    try {
        const email = new Email(req.body);
        await email.save(); // Save the email to the inbox collection
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error saving email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;