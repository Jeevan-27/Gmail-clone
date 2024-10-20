const express = require('express');
const router = express.Router();
const Draft = require('../models/Drafts');

// POST route to save drafts
router.post('/', async (req, res) => {
    const { to, from, cc, bcc, subject, body, attachments } = req.body;

    try {
        const newDraft = new Draft({
            to,
            from,
            cc,
            bcc,
            subject,
            body,
            attachments,
        });

        await newDraft.save();
        res.status(201).json(newDraft);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving draft' });
    }
});

// GET route to fetch drafts for the logged-in user
router.get('/', async (req, res) => {
    const { email } = req.query; // Extract the email from the query parameters

    try {
        // Fetch all drafts from the database where the 'from' field matches the logged-in user's email
        const drafts = await Draft.find({ from: email });
        res.status(200).json(drafts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching drafts', error });
    }
});

module.exports = router;
