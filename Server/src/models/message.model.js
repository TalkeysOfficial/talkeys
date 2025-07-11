const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String },

  // DM-specific
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDM: { type: Boolean, default: false },

  // Group-specific
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },

  type: { type: String, enum: ['text', 'image'], default: 'text' },
  media: {
    url: String,
    filename: String,
  },

  createdAt: { type: Date, default: Date.now },
});

// Indexes
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ groupId: 1 });
messageSchema.index({ createdAt: 1 });
messageSchema.index({ isDM: 1 });
messageSchema.index({ sender: 1, receiver: 1, isDM: 1, createdAt: 1 });

// Validation Hook
messageSchema.pre('save', function (next) {
  if (this.isDM && !this.receiver) {
    return next(new Error("Receiver is required for DMs."));
  }
  if (!this.isDM && !this.groupId) {
    return next(new Error("GroupId is required for group messages."));
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
