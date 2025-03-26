const Meeting = require("../models/Meeting");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");
const PersonalClass = require("../models/PersonalClass");

const meetingController = {
    createMeeting: async (req, res) => {
        try {
          const { classId, title, description, location, time } = req.body;
          const adminId = req.user.id;
    
          // Kiểm tra lớp học hợp lệ
          const personalClass = await PersonalClass.findById(classId).populate("students", "email username");
          if (!personalClass) {
            return res.status(404).json({ message: "Lớp học không tồn tại" });
          }
    
          // Tạo cuộc họp
          const meeting = new Meeting({
            class: classId,
            title,
            description,
            location,
            time,
            attendees: personalClass.students.map(student => ({ student: student._id })),
            createdBy: adminId
          });
    
          await meeting.save();
    
          // Gửi email thông báo
          personalClass.students.forEach(student => {
            const subject = "Lời mời tham gia cuộc họp lớp";
            const text = `Chào ${student.username},\n\nBạn được mời tham gia cuộc họp "${title}".\n\n📍 Địa điểm: ${location}\n⏰ Thời gian: ${new Date(time).toLocaleString()}\n\nVui lòng tham gia đúng giờ.\n\nTrân trọng,\nAdmin`;
            sendEmail(student.email, subject, text);
          });
    
          res.status(201).json({ message: "Cuộc họp đã được tạo", meeting });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      },
    getMeetingsByClass: async (req, res) => {
        try {
          const { classId } = req.params;
          const meetings = await Meeting.find({ class: classId })
            .populate({ path: "class", select: "name" })
            .populate({ path: "attendees.student", select: "username email" });

    
          res.status(200).json({ meetings });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      },
    markAttendance: async (req, res) => {
        try {
          const { meetingId } = req.params;
          const { studentIds } = req.body;
    
          const meeting = await Meeting.findById(meetingId);
          if (!meeting) {
            return res.status(404).json({ message: "Cuộc họp không tồn tại" });
          }
    
          // Đánh dấu điểm danh
          meeting.attendees.forEach(attendee => {
            if (studentIds.includes(attendee.student.toString())) {
              attendee.attended = true;
            }
          });
    
          await meeting.save();
    
          res.status(200).json({ message: "Điểm danh thành công", meeting });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
}
 module.exports =  meetingController ;