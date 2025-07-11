const Message = require("../models/message.model");
const User = require("../models/users.model");

exports.sendDM = async (req, res) => {
  try {
    const { receiverId, content, type, media } = req.body;

    const newMessage = new Message({
      sender: req.user._id,
      senderName: req.user.name,
      receiver: receiverId,
      content,
      type: type || "text",
      media: media || null,
      isDM: true,
    });

    const saved = await newMessage.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error sending DM", error: err.message });
  }
};

exports.getDMConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          isDM: true,
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    const populated = await User.populate(conversations, {
      path: "_id",
      select: "name image",
    });

    res.json(populated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching conversations", error: err.message });
  }
};

exports.getDMHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const selfId = req.user._id;

    const messages = await Message.find({
      isDM: true,
      $or: [
        { sender: selfId, receiver: userId },
        { sender: userId, receiver: selfId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching DM history" });
  }
};
