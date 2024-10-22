// const express = require('express');
// const router = express.Router();
// const Draft = require('../models/Drafts');

// // POST route to save drafts
// router.post('/', async (req, res) => {
//     const { to, from, cc, bcc, subject, body, attachments } = req.body;

//     try {
//         const newDraft = new Draft({
//             to,
//             from,
//             cc,
//             bcc,
//             subject,
//             body,
//             attachments,
//         });

//         await newDraft.save();
//         res.status(201).json(newDraft);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error saving draft' });
//     }
// });

// // GET route to fetch drafts for the logged-in user
// router.get('/', async (req, res) => {
//     const { email } = req.query; // Extract the email from the query parameters

//     try {
//         // Fetch all drafts from the database where the 'from' field matches the logged-in user's email
//         const drafts = await Draft.find({ from: email });
//         res.status(200).json(drafts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching drafts', error });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Draft = require('../models/Drafts');

router.delete('/:id', async (req, res) => {
    try {
        const draftId = req.params.id;
        const deletedDraft = await Draft.findByIdAndDelete(draftId);
        if (!deletedDraft) {
            return res.status(404).json({ message: 'Draft not found' });
        }
        res.status(200).json({ message: 'Draft deleted successfully' });
    } catch (error) {
        console.error('Error deleting draft:', error);
        res.status(500).json({ message: 'Error deleting draft', error });
    }
});


router.post('/', async (req, res) => {
    const { _id, to, from, cc, bcc, subject, body, attachments } = req.body;
    console.log('Received draft data for saving:', { _id, to, from, cc, bcc, subject, body, attachments });

    try {
        let draft;

        if (_id) {
            console.log('hopeful');
            draft = await Draft.findByIdAndUpdate(
                _id,
                { to, from, cc, bcc, subject, body, attachments, date: Date.now() },
                { new: true } // Return the updated document
            );

            // If the draft was not found, return a 404 status
            if (!draft) {
                return res.status(404).json({ message: 'Draft not found for update' });
            }
        } else {
            draft = new Draft({
                to,
                from,
                cc,
                bcc,
                subject,
                body,
                attachments,
            });
            await draft.save();
        }

        // Return 200 for updates and 201 for new drafts
        res.status(_id ? 200 : 201).json(draft);
    } catch (error) {
        console.error('Error saving draft:', error);
        res.status(500).json({ message: 'Error saving draft', error: error.message });
    }
});


router.get('/', async (req, res) => {
    const { email } = req.query; 

    try {
        
        const drafts = await Draft.find({ from: email });
        res.status(200).json(drafts);
    } catch (error) {
        console.error('Error fetching drafts:', error);
        res.status(500).json({ message: 'Error fetching drafts', error });
    }
});

module.exports = router;