const fs = require("fs");
const Post = require("../models/post.model");
const User = require("../models/users.model");
const Community = require("../models/communities.model");
const { upload, cloudinary } = require("../service/cloudinary");

// Create a new post
exports.createPost = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Image upload error" });
    }

    try {
      const { communityId, content, linkPreview } = req.body;

      const community = await Community.findById(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      let imageUrl = "";
      let imagePublicId = "";

      if (req.file) {
        const uploadRes = await cloudinary.uploader.upload(req.file.path, {
          public_id: `post_image_${Date.now()}`,
        });

        // Delete local file after upload
        fs.unlinkSync(req.file.path);

        imagePublicId = uploadRes.public_id;
        imageUrl = cloudinary.url(uploadRes.public_id, {
          fetch_format: "auto",
          quality: "auto",
        });
      }

      const post = new Post({
        community: communityId,
        content,
        image: imageUrl,
        imagePublicId,
        author: req.user._id,
        linkPreview: linkPreview || null,
      });

      const savedPost = await post.save();

      res.status(201).json(savedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating post" });
    }
  });
};

// Fetch posts by community
exports.getPostsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const posts = await Post.find({ community: communityId })
      .sort({ createdAt: -1 })
      .populate("author", "name image")
      .populate("comments.author", "name image");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Fetch single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("author", "name image")
      .populate("comments.author", "name image");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error liking post" });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error unliking post" });
  }
};

// Comment on post
exports.commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            author: req.user._id,
            content,
          },
        },
      },
      { new: true }
    )
      .populate("author", "name image")
      .populate("comments.author", "name image");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Authorization: only post author or admin can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    // Delete image from Cloudinary if exists
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
      } catch (cloudErr) {
        console.warn("Cloudinary cleanup failed:", cloudErr.message);
      }
    }

    await post.remove();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
};