const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: String,
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  type: { type: String, enum: ['text', 'image', 'link'], default: 'text' },
  media: {
    url: String,
    type: String
  },
  link: {
    url: String,
    title: String
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  score: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
