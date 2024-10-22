const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  emailId: { type: String, required: true },
  recoveryEmail: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '10m' } // OTP expires after 10 minutes
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;