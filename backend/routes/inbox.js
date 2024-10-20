const express = require('express');
const Email = require('../models/Email'); 

const router = express.Router();


router.get('/', async (req, res) => {
  const { email } = req.query; 

  try {
    const emails = await Email.find({ to: email }); 
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// routes/inbox.js (Add this route for deleting emails)
router.put('/:id/delete', async (req, res) => {
  const { id } = req.params;
  const { bin } = req.body;

  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { bin },
      { new: true }
    );
    if (!updatedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating email', error });
  }
});


router.put('/:id/star', async (req, res) => {
  const { id } = req.params;
  const { starred } = req.body;

  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { starred },
      { new: true }
    );
    if (!updatedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating starred status', error });
  }
});

module.exports = router;