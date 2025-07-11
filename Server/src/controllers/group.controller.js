const Group = require("../models/group.model");
const Message = require("../models/message.model");
const Community = require("../models/communities.model");

exports.getGroupsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const groups = await Group.find({ communityId }).sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, communityId } = req.body;

    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    const newGroup = new Group({
      name,
      communityId,
      messageCount: 0,
      lastMessage: null,
    });

    const savedGroup = await newGroup.save();

    await Community.findByIdAndUpdate(communityId, {
      $push: { groups: savedGroup._id },
    });

    res.status(201).json(savedGroup);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating group", error: err.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ groupId: id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type, media } = req.body;

    const newMessage = new Message({
      groupId: id,
      content,
      sender: req.user._id,
      senderName: req.user.name,
      type: type || "text",
      media: media || null,
    });

    const saved = await newMessage.save();

    await Group.findByIdAndUpdate(id, {
      $inc: { messageCount: 1 },
      lastMessage: {
        content,
        sender: req.user._id,
        senderName: req.user.name,
        timestamp: new Date(),
      },
    });

    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending message", error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findByIdAndDelete(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting group" });
  }
};