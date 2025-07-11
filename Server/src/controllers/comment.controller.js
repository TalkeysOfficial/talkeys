const Comment = require("../models/comment.model");
const Post = require("../models/post.model");


exports.addComment = async (req, res) => {
  try {
    const { postId, text, parentId } = req.body;

    const comment = new Comment({
      postId,
      text,
      author: req.user._id,
      authorName: req.user.name,
      parentId: parentId || null,
      upvotes: [],
      downvotes: [],
      score: 0,
    });

    const saved = await comment.save();

    
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err });
  }
};


exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err });
  }
};


exports.voteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.upvotes.pull(userId);
    comment.downvotes.pull(userId);

    if (voteType === "up") comment.upvotes.push(userId);
    else if (voteType === "down") comment.downvotes.push(userId);

    comment.score = comment.upvotes.length - comment.downvotes.length;
    await comment.save();

    res.json({ commentId, score: comment.score });
  } catch (err) {
    res.status(500).json({ message: "Error voting on comment", error: err });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Authorization: only comment author or admin can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await comment.remove();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
