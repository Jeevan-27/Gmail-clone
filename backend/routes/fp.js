const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Ensure this is your correct User model path
const Otp = require('../models/Otp'); // Ensure this is your OTP model path
const Email = require('../models/Email');

// Route to fetch recovery email
router.get('/:emailId', async (req, res) => {
  
  const { emailId } = req.params;
  try {
    const user = await User.findOne({emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ recoveryEmail: user.recoveryEmail });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Route to send OTP (frontend generates OTP)
router.post('/send-otp', async (req, res) => {
  const { emailId, recoveryEmail, otp } = req.body; // Get otp and emails from the request body

  try {
    // Check if there's an existing OTP entry for this user
    let otpEntry = await Otp.findOne({ emailId });

    if (otpEntry) {
      // If an OTP entry exists, update the OTP and timestamp
      otpEntry.otp = otp;
      otpEntry.createdAt = new Date();
      await otpEntry.save();
    } else {
      // If no OTP entry exists, create a new entry
      otpEntry = new Otp({
        emailId,
        recoveryEmail,
        otp,
        createdAt: new Date(), // Save the timestamp
      });
      await otpEntry.save();
    }

    // Find user by recovery email
    let user = await User.findOne({ recoveryEmail });

    if (user) {
      // Create the email entry for the inbox
      const emailEntry = new Email({
        to: recoveryEmail,
        from: 'support@hedwig.com',
        subject: 'Your OTP for Password Reset',
        body: `Your OTP is: ${otp}`, // Include the OTP in the email body
        date: new Date(),
        attachments: [] // Assuming no attachments
      });

      // Save the email in the inbox (Email collection)
      await emailEntry.save();

      // Send a success response
      res.json({ message: 'OTP email sent and saved in inbox successfully.' });
    } else {
      // If the user is not found, return a 404 error
      res.status(404).json({ message: 'User with this recovery email not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { emailId, otp } = req.body;
  try {
    const otpEntry = await Otp.findOne({ emailId, otp });
    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Optionally, check if the OTP is expired based on the createdAt timestamp
    const otpAge = new Date() - otpEntry.createdAt; // Calculate age of OTP
    const otpValidityDuration = 5 * 60 * 1000; 
    if (otpAge > otpValidityDuration) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // OTP is valid
    res.json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Route to reset password
router.post('/reset-password', async (req, res) => {
  const { emailId, newPassword } = req.body;

  try {
    // Find the user by emailId
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds (or adjust rounds as needed)
    const hashedPassword = await bcrypt.hash(newPassword, salt); // Hash the password

    // Update the user's password with the hashed one
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;