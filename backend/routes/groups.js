const express = require('express');
const Group = require('../models/Group');
const router = express.Router();

// Fetch groups for the logged-in user (either as owner or member)
router.post('/fetch-groups', async (req, res) => {
  const { emailId } = req.body; // Expect emailId to be in the request body

  if (!emailId) {
    return res.status(401).json({ message: 'Access denied. No email provided.' });
  }

  try {
    // Fetch groups where the user is either the owner or a member
    const groups = await Group.find({
      $or: [{ ownerId: emailId }, { members: emailId }]
    }).populate('members', 'username emailId'); // Populate members with their details

    if (!groups.length) {
      return res.status(404).json({ message: 'No groups found for the user' });
    }

    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new group
router.post('/create', async (req, res) => {
  const { groupName, groupDescription, members } = req.body; // Don't expect emailId from frontend

  // Get logged-in user's emailId from localStorage in the frontend and send in req.body
  const emailId = req.body.emailId; 

  if (!emailId) {
    return res.status(401).json({ message: 'Access denied. No email provided.' });
  }

  try {
    // Basic validation
    if (!groupName || !members || members.length === 0) {
      return res.status(400).json({ message: 'Group name and members are required' });
    }

    const newGroup = new Group({
      ownerId: emailId, // Set ownerId from the logged user's emailId
      groupName,
      groupDescription: groupDescription || '', // Optional description
      members // Store the emailId array directly
    });

    const savedGroup = await newGroup.save();
    res.status(201).json({ message: 'Group created successfully', group: savedGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;