  const { getReceiverSocketId, io } = require("../lib/socket.js");
  const Message = require("../models/Message.js");
  const User = require("../models/User.js");
  const Cloudinary = require("../lib/cloudinary.js");

  const messageController = {
  getUserToChat : async (req, res) => {
      try {
      const loggedInUserId = req.user.id;
      const filteredUsers = await User.find({ id: { $ne: loggedInUserId } }).select("-password");
      res.status(200).json(filteredUsers);
      } catch (error) {
      console.log("Error in getting users to chat", error.message);
      res.status(500).json({ message: "Server error" });
      }
      },

  getMessages : async (req, res) => {
      try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;

      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });

      res.status(200).json(messages);
      } catch (error) {
      console.log("Error in getting messages:", error.message);
      res.status(500).json({ message: "Server error" });
      }
      },

  sendMessage : async (req, res) => {
      try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user.id;

      let imageUrl = "";
      if (image) {
        const uploadResponse = await Cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }

      const newMessage = Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(200).json(newMessage);
      } catch (error) {
      console.log("Error in sending message controller:", error.message);
      res.status(500).json({ message: "Server error" });
      }
      },
  };

  module.exports = messageController;