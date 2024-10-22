// const express = require('express');
// const router = express.Router();
// const Email = require('../models/Email');

// // Restore email from bin (set bin to false)
// router.put('/:id/restore', async (req, res) => {
//   try {
//     const emailId = req.params.id;
//     // Update the email's bin field to false
//     await Email.findByIdAndUpdate(emailId, { bin: false });
//     res.status(200).send('Email restored successfully');
//   } catch (error) {
//     console.error('Error restoring email:', error);
//     res.status(500).send('Error restoring email');
//   }
// });

// // Get bin emails for a specific user
// router.get('/', async (req, res) => {
//   const { email } = req.query;

//   try {
//     // Fetch all bin emails for the logged-in user
//     const binEmails = await Email.find({ to: email, bin: true });
//     res.json(binEmails);
//   } catch (err) {
//     console.error('Error fetching bin emails:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Email = require('../models/Email');

// Restore email from bin (set bin or binSend to false based on user)
router.put('/:id/restore', async (req, res) => {
  try {
    const emailId = req.params.id;
    const { userEmail } = req.body; // User's email to determine context

    const email = await Email.findById(emailId);

    if (!email) {
      return res.status(404).send('Email not found');
    }

    // Check if the logged-in user is the sender or recipient and restore accordingly
    if (email.from === userEmail && email.binSend === true) {
      await Email.findByIdAndUpdate(emailId, { binSend: false });
      res.status(200).send('Email restored for the sender successfully');
    } else if (email.to === userEmail && email.bin === true) {
      await Email.findByIdAndUpdate(emailId, { bin: false });
      res.status(200).send('Email restored for the recipient successfully');
    } else {
      res.status(400).send('No action required');
    }
  } catch (error) {
    console.error('Error restoring email:', error);
    res.status(500).send('Error restoring email');
  }
});

// Get bin emails for a specific user (either from or to)
router.get('/', async (req, res) => {
  const { email } = req.query;

  try {
    // Fetch all bin emails where the logged-in user is either sender or recipient
    const binEmails = await Email.find({
      $or: [
        { from: email, binSend: true },
        { to: email, bin: true }
      ]
    });
    res.json(binEmails);
  } catch (err) {
    console.error('Error fetching bin emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Permanently delete email from bin
router.delete('/:id', async (req, res) => {
  try {
    const emailId = req.params.id;
    const { userEmail } = req.body; // The logged-in user's email

    // Find the email by ID
    const email = await Email.findById(emailId);

    if (!email) {
      return res.status(404).send('Email not found');
    }

    // Flag to check if any updates were made
    let updated = false;

    // 1. If the user is the sender and binSend is true, remove the binSend field
    if (email.from === userEmail && email.binSend === true) {
      await Email.updateOne({ _id: emailId }, { $unset: { binSend: "" } });
      
      updated = true;
    }
    
    // 2. If the user is the recipient and bin is true, remove the bin field
    if (email.to === userEmail && email.bin === true) {
      await Email.updateOne({ _id: emailId }, { $unset: { bin: "" } });
      updated = true;
    }

    // if (!email.hasOwnProperty('binSend') && !email.hasOwnProperty('bin')) {
    //   await Email.findByIdAndDelete(emailId); // Delete email if neither field exists
    //   return res.status(200).send('Email permanently deleted');
    // }
    
    // If only one of the fields was removed, update the email in the database
    if (updated) {
      return res.status(200).send('Email bin flags updated successfully');
    }

    res.status(400).send('No action required');
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).send('Error deleting email');
  }
});

module.exports = router;