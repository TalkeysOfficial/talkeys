const Message = require("./models/message.model");
const User = require("./models/users.model");
const Group = require("./models/group.model");

const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join user's own room for DMs
    socket.on("join-user", (userId) => {
      socket.join(`user-${userId}`);
      console.log(` Joined personal room user-${userId}`);
    });

    // Join a group room
    socket.on("join-group", (groupId) => {
      socket.join(`group-${groupId}`);
      console.log(`🔗Joined group room group-${groupId}`);
    });

    // Leave a group room
    socket.on("leave-group", (groupId) => {
      socket.leave(`group-${groupId}`);
      console.log(` Left group room group-${groupId}`);
    });

    // Send Message (Group or DM)
    socket.on("send-message", async (data) => {
      const {
        content,
        senderId,
        senderName,
        groupId,
        receiverId,
        isDM,
        type,
        media,
      } = data;

      try {
        const message = new Message({
          content,
          sender: senderId,
          senderName,
          groupId: isDM ? null : groupId,
          receiver: isDM ? receiverId : null,
          isDM,
          type: type || "text",
          media: media || null,
        });

        const savedMessage = await message.save();

        if (isDM) {
          // Emit to both sender and receiver
          io.to(`user-${senderId}`).emit("new-dm", savedMessage);
          io.to(`user-${receiverId}`).emit("new-dm", savedMessage);
        } else {
          // Emit to everyone in the group room
          io.to(`group-${groupId}`).emit("new-group-message", savedMessage);
        }
      } catch (err) {
        console.error(" Error saving message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(" Client disconnected:", socket.id);
    });
  });
};

module.exports = registerSocketHandlers;
