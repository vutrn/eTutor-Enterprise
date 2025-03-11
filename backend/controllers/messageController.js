  const { getReceiverSocketId, io } = require("../lib/socket.js");
  const Message = require("../models/Message.js");
  const User = require("../models/User.js");
  const Cloudinary = require("../lib/cloudinary.js");
  const PersonalClass = require("../models/PersonalClass");

  const messageController = {

    // Lấy danh sách thành viên trong lớp học
  getUserToChat: async (req, res) => {
    try {
      const { classId } = req.params; 
      // Lấy thông tin lớp học từ ID
      const classroom = await PersonalClass.findById(classId).populate("students tutor admin", "-password");
      if (!classroom) {
        return res.status(404).json({ message: "Lớp học không tồn tại" });
      }

      // Danh sách
      const members = [
        classroom.admin,
        classroom.tutor,
        ...classroom.students,
      ].filter((user) => user !== null); 
      res.status(200).json(members);
    } catch (error) {
      console.log("Error in getting users to chat:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Lấy tin nhắn giữa user hiện tại và người khác trong lớp
  getMessages: async (req, res) => {
    try {
      const { receiverId } = req.params;
      const senderId = req.user.id;

      // Truy vấn tin nhắn giữa hai người
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian

      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getting messages:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Gửi tin nhắn trong lớp học
  sendMessage: async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user.id;

      console.log("Sender ID:", senderId);
      console.log("Receiver ID:", receiverId);
  
      //Tìm lớp học mà cả sender và receiver đều tham gia
      const commonClass = await PersonalClass.findOne({
        $or: [
          { tutor: senderId, students: receiverId },
          { tutor: receiverId, students: senderId },
          { admin: senderId, students: receiverId },
          { admin: receiverId, students: senderId },
          { tutor: senderId, admin: receiverId },
          { tutor: receiverId, admin: senderId }
        ],
      });
      console.log("Common class found:", commonClass);

  
      if (!commonClass) {
        return res.status(403).json({ message: "Người nhận không nằm trong lớp của bạn!" });
      }
  
      let imageUrl = "";
      if (image) {
        const uploadResponse = await Cloudinary.uploader.upload(image, { folder: "messages" });
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
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
      console.log("Error in sending message:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = messageController;