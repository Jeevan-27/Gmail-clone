// const express = require('express');
// const router = express.Router();
// const Email = require('../models/Email'); // Make sure this path is correct

// // POST route to handle sending emails
// router.post('/', async (req, res) => {
//     try {
//         const email = new Email(req.body);
//         await email.save(); // Save the email to the inbox collection
//         res.status(200).json({ message: 'Email sent successfully!' });
//     } catch (error) {
//         console.error('Error saving email:', error);
//         res.status(500).json({ error: 'Failed to send email' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Email = require('../models/Email'); // Make sure this path is correct

// POST route to handle sending emails
router.post('/', async (req, res) => {
    const { to, from, subject, body } = req.body;

    // Ensure 'to' is an array of emails
    const recipients = to.split(',').map(email => email.trim());

    try {
        // Create and save an email for each recipient
        const emailPromises = recipients.map(recipient => {
            const email = new Email({
                to: [recipient], // Store recipient in an array
                from,
                subject,
                body,
                date: new Date(), // Set current date
                starred: false,
                bin: false,
                type: 'inbox',
                attachments: [] // Add attachments if needed
            });
            return email.save(); // Save each email
        });

        await Promise.all(emailPromises); // Wait for all emails to be saved
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error saving email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;