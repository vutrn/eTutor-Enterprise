const PersonalClass = require("../models/PersonalClass");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");
const mongoose = require("mongoose");

const personalClassController = {
  createPersonalClass: async (req, res) => {
    try {
      const { name, tutorId, studentIds = [] } = req.body;
      const adminId = req.user.id; // Lấy từ token

      // Kiểm tra tutor có hợp lệ không
      const tutor = await User.findById(tutorId);
      if (!tutor || tutor.role !== "tutor") {
        return res.status(400).json({ message: "Tutor không hợp lệ" });
      }

      // Kiểm tra danh sách học sinh hợp lệ
      const students = await User.find({ _id: { $in: studentIds }, role: "student" });
      if (students.length !== studentIds.length) {
        return res.status(400).json({ message: "Một số học sinh không hợp lệ" });
      }

      // Tạo lớp học mới
      const personalClass = new PersonalClass({
        name,
        tutor: tutorId,
        students: [...new Set(studentIds)],
        admin: adminId,
      });
      await personalClass.save();

      students.forEach((student) => {
        const subject = "Bạn đã được thêm vào lớp học";
        const text = `Chào ${student.username},\n\nBạn đã được thêm vào lớp "${personalClass.name}".\n\nHãy chuẩn bị học tập thật tốt nhé!\n\nTrân trọng,\nAdmin`;

        sendEmail(student.email, subject, text);
      });
      const tutorSubject = "Bạn đã được phân công làm gia sư";
      const tutorText = `Chào ${tutor.username},\n\nBạn đã được chỉ định làm gia sư cho lớp "${personalClass.name}".\n\nHãy chuẩn bị hướng dẫn các học sinh nhé!\n\nTrân trọng,\nAdmin`;

      sendEmail(tutor.email, tutorSubject, tutorText);

      res.status(201).json({ message: "Lớp học đã được tạo", personalClass });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  getPersonalClass: async (req, res) => {
    try {
      const personalClasses = await PersonalClass.find()
        .populate("tutor", "username email")
        .populate("students", "username email")
        .populate("admin", "username email");

      res.status(200).json({ personalClasses });
    } catch (error) {
      res.status(500).json({ message: "Lỗi get class", error: error.message });
    }
  },

  deletePersonalClass: async (req, res) => {
    try {
      const { personalClassId } = req.params;

      const personalClass = await PersonalClass.findById(personalClassId);
      if (!personalClass) return res.status(404).json({ message: "Lớp học không tồn tại" });

      await personalClass.deleteOne();
      res.status(200).json({ message: "Lớp học đã bị xóa" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  updateClass: async (req, res) => {
    try {
      const { personalClassId } = req.params;
      const { newTutorId, newName, studentIds } = req.body;
      console.log("req.params", req.params);
      console.log("req.body", req.body);
      if (!mongoose.Types.ObjectId.isValid(personalClassId)) {
        return res.status(400).json({ message: "ID lớp không hợp lệ" });
      }

      const personalClass = await PersonalClass.findById(personalClassId);
      if (!personalClass) {
        return res.status(404).json({ message: "Lớp học không tồn tại" });
      }

      let updatedFields = [];

      // Handle student updates
      if (studentIds) {
        // Get current students for comparison
        const currentStudentIds = personalClass.students.map((id) => id.toString());
        const newStudentIds = studentIds.map((id) => id.toString());

        const removedStudentIds = currentStudentIds.filter((id) => !newStudentIds.includes(id));

        const addedStudentIds = newStudentIds.filter((id) => !currentStudentIds.includes(id));

        if (removedStudentIds.length > 0 || addedStudentIds.length > 0) {
          // Verify all new students are valid
          const students = await User.find({
            _id: { $in: [...addedStudentIds, ...removedStudentIds] },
            role: "student",
          });

          // Send notifications to removed students
          const removedStudents = students.filter((s) =>
            removedStudentIds.includes(s._id.toString())
          );
          removedStudents.forEach((student) => {
            sendEmail(
              student.email,
              "Bạn đã được rời khỏi lớp học",
              `Chào ${student.username},\n\nBạn đã được rời khỏi lớp "${personalClass.name}".\n\nTrân trọng,\nAdmin`
            );
          });

          // Send notifications to added students
          const addedStudents = students.filter((s) => addedStudentIds.includes(s._id.toString()));
          addedStudents.forEach((student) => {
            sendEmail(
              student.email,
              "Bạn đã được thêm vào lớp học",
              `Chào ${student.username},\n\nBạn đã được thêm vào lớp "${personalClass.name}".\n\nHãy chuẩn bị học tập thật tốt nhé!\n\nTrân trọng,\nAdmin`
            );
          });

          // Update the class's student list
          personalClass.students = studentIds;
          updatedFields.push("students");
        }
      }

      // Thay đổi gia sư
      if (newTutorId) {
        const newTutor = await User.findById(newTutorId);
        if (!newTutor || newTutor.role !== "tutor") {
          return res.status(400).json({ message: "Gia sư không hợp lệ" });
        }

        personalClass.tutor = newTutorId;
        updatedFields.push("tutor");

        sendEmail(
          newTutor.email,
          "Bạn đã được phân công làm gia sư",
          `Chào ${newTutor.username},\n\nBạn đã được chỉ định làm gia sư cho lớp "${personalClass.name}".\n\nHãy chuẩn bị hướng dẫn các học sinh nhé!\n\nTrân trọng,\nAdmin`
        );
      }

      // Cập nhật tên lớp
      if (newName) {
        if (newName.trim() === "") {
          return res.status(400).json({ message: "Tên lớp mới không hợp lệ" });
        }

        personalClass.name = newName.trim();
        updatedFields.push("name");
      }

      if (updatedFields.length === 0) {
        return res.status(400).json({ message: "Không có thay đổi nào được thực hiện" });
      }

      await personalClass.save();
      res.status(200).json({
        message: "Cập nhật lớp học thành công",
        updatedFields,
        personalClass,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = personalClassController;
