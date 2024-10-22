// const express = require('express');
// const router = express.Router();
// const Email = require('../models/Email'); 

// // Get sent emails for a specific user
// router.get('/', async (req, res) => {
//     const { email } = req.query;

//     try {
//         const sentEmails = await Email.find({ from: email });
//         res.json(sentEmails);
//     } catch (error) {
//         console.error('Error fetching sent emails:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // PUT route to move an email to the bin
// router.put('/:id/bin', async (req, res) => {
//     const emailId = req.params.id;

//     try {
//         await Email.findByIdAndUpdate(emailId, { binSend: true });
//         res.status(200).send('Email moved to bin successfully');
//     } catch (error) {
//         console.error('Error moving email to bin:', error);
//         res.status(500).send('Error moving email to bin');
//     }
// });

// // POST route to forward an email
// router.post('/', async (req, res) => {
//     const { from, to, subject, body, attachments, date } = req.body;

//     // Create a new email entry for the forwarded email
//     const forwardedEmail = new Email({
//         from,
//         to,
//         subject: `${subject} (Forwarded)`, // Append (Forwarded) to the subject
//         body,
//         attachments: attachments || [], // Include attachments if present
//         date: new Date(), // Set the current date
//         binSend: false, // Ensure it's not marked as deleted
//     });

//     try {
//         const savedEmail = await forwardedEmail.save();
//         res.status(201).json(savedEmail);
//     } catch (error) {
//         console.error('Error forwarding email:', error);
//         res.status(500).json({ message: 'Error creating forwarded email', error });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Email = require('../models/Email'); 

// GET route to fetch sent emails
router.get('/', async (req, res) => {
    const { email } = req.query;

    try {
        const sentEmails = await Email.find({ from: email, binSend: false });
        res.json(sentEmails);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT route to move an email to the bin
router.put('/:id/bin', async (req, res) => {
    const emailId = req.params.id;

    try {
        await Email.findByIdAndUpdate(emailId, { binSend: true });
        res.status(200).send('Email moved to bin successfully');
    } catch (error) {
        console.error('Error moving email to bin:', error);
        res.status(500).send('Error moving email to bin');
    }
});

// POST route to forward an email
router.post('/', async (req, res) => {
    const { from, to, subject, body, attachments, date } = req.body;

    // Create a new email entry for the forwarded email
    const forwardedEmail = new Email({
        from,
        to,
        subject: `${subject} (Forwarded)`, // Append (Forwarded) to the subject
        body,
        attachments: attachments || [], // Include attachments if present
        date: new Date(), // Set the current date
        binSend: false, // Ensure it's not marked as deleted
    });

    try {
        const savedEmail = await forwardedEmail.save();
        res.status(201).json(savedEmail);
    } catch (error) {
        console.error('Error forwarding email:', error);
        res.status(500).json({ message: 'Error creating forwarded email', error });
    }
});

module.exports = router;