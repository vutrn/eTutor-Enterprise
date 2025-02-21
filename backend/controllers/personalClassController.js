const PersonalClass = require("../models/PersonalClass");
const User = require("../models/User");

const personalClassController = {

    createPersonalClass:async (req, res) => {
    try {
        const { name, tutorId } = req.body;
        const adminId = req.user.id; // Lấy từ token
    
        // Kiểm tra tutor có hợp lệ không
        const tutor = await User.findById(tutorId);
        if (!tutor || tutor.role !== "tutor") {
          return res.status(400).json({ message: "Tutor không hợp lệ" });
        }
    
        // Tạo lớp học mới
        const personalClass = new PersonalClass({
          name,
          tutor: tutorId,
          students: [],
          admin: adminId,
        });
        await personalClass.save();
    
        res.status(201).json({ message: "Lớp học đã được tạo", personalClass });
      } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
      }
    },

    getPersonalClass: async(req, res) => {
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

    addStudentsToClass: async (req, res) => {
        try {
          const { personalClassId } = req.params;
          const { studentIds } = req.body;
          const adminId = req.user.id;
      
          const personalClass = await PersonalClass.findById(personalClassId);
          if (!personalClass) return res.status(404).json({ message: "Lớp học không tồn tại" });
          // Kiểm tra học sinh hợp lệ
          const students = await User.find({ _id: { $in: studentIds }, role: "student" });
          if (students.length !== studentIds.length) {
            return res.status(400).json({ message: "Một số học sinh không hợp lệ" });
          }
      
          // Thêm học sinh vào lớp (tránh trùng lặp)
          personalClass.students = [...new Set([...personalClass.students, ...studentIds])];
          await personalClass.save();
      
          res.status(200).json({ message: "Danh sách học sinh đã được cập nhật", personalClass });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
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

      removeStudentFromClass :async (req, res) => {
        try {
          const { personalClassId, studentId } = req.params;
      
          const personalClass = await PersonalClass.findById(personalClassId);
          if (!personalClass) return res.status(404).json({ message: "Lớp học không tồn tại" });

          if (!personalClass.students.includes(studentId)) {
            return res.status(400).json({ message: "Học sinh không có trong lớp này" });
          }
      
          // Xóa học sinh khỏi danh sách
          personalClass.students = personalClass.students.filter(id => id.toString() !== studentId);
          await personalClass.save();
      
          res.status(200).json({ message: "Đã xóa học sinh khỏi lớp" });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
}



module.exports = personalClassController
  