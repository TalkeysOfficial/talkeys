const fs = require("fs");
const Message = require("../models/message.model");
const Community = require("../models/communities.model");
const Group = require("../models/group.model");
const { upload, cloudinary } = require("../service/cloudinary");

// Send a new message (with optional image)
exports.sendMessage = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Image upload error" });
    }

    try {
      const { communityId, groupId, text } = req.body;

      // Check if community exists
      const community = await Community.findById(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      // Check if group exists (if provided)
      if (groupId) {
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: "Group not found" });
        }
      }

      // Upload image (if present)
      let imageUrl = "";
      let imagePublicId = "";
      if (req.file) {
        const uploaded = await cloudinary.uploader.upload(req.file.path, {
          public_id: `message_image_${Date.now()}`,
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        imageUrl = cloudinary.url(uploaded.public_id, {
          fetch_format: "auto",
          quality: "auto",
        });
        imagePublicId = uploaded.public_id;
      }

      const message = new Message({
        community: communityId,
        groupId: groupId || null,
        sender: req.user._id,
        senderName: req.user.name,
        text: text || "",
        image: imageUrl,
        imagePublicId: imagePublicId,
      });

      const saved = await message.save();

      res.status(201).json(saved);
    } catch (error) {
      console.error("Error sending message:", error.message);
      res.status(500).json({ message: "Error sending message" });
    }
  });
};

// Get all messages for a community
exports.getMessagesByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const messages = await Message.find({ community: communityId })
      .sort({ createdAt: 1 })
      .populate("sender", "name image");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching community messages:", error.message);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Get messages by group
exports.getMessagesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const messages = await Message.find({ groupId })
      .sort({ createdAt: 1 })
      .populate("sender", "name image");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error.message);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Delete a message (only sender or admin)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (
      message.sender.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete image from Cloudinary if exists
    if (message.imagePublicId) {
      await cloudinary.uploader.destroy(message.imagePublicId);
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ message: "Error deleting message" });
  }
};
