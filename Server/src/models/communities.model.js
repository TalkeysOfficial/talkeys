const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  slug: { type: String, required: true, unique: true },
  icon: String, 
  memberCount: { type: Number, default: 1 },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);