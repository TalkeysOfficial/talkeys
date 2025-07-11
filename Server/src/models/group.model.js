const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  messageCount: { type: Number, default: 0 },
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    timestamp: Date
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);
