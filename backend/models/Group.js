const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  groupDescription: {
    type: String,
  },
  members: {
    type: [String],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema); 