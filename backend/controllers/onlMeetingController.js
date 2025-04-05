const OnlMeeting = require("../models/OnlineMeet");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");
const PersonalClass = require("../models/PersonalClass");
const { getAllMeetings } = require("./meetingController");

const onlMeetingController = {
    createOnlMeeting: async (req, res) => {
        try {
          const { classId, title, linkggmeet, time } = req.body;
          const adminId = req.user.id;

          const personalClass = await PersonalClass.findById(classId).populate("students", "email username");
          if (!personalClass) {
            return res.status(404).json({ message: "Lớp học không tồn tại" });
          }
    
          const onlmeeting = new OnlMeeting({
            class: classId,
            title,
            linkggmeet,
            time,
            attendees: personalClass.students.map(student => ({ student: student._id })),
            createdBy: adminId
          });
    
          await onlmeeting.save();
    
          // Gửi email thông báo
          personalClass.students.forEach(student => {
            const subject = "Lời mời tham gia cuộc họp lớp";
            const text = `Chào ${student.username},\n\nBạn được mời tham gia cuộc họp "${title}".\n\n📍 Link Phòng Họp: ${linkggmeet}\n⏰ Thời gian: ${new Date(time).toLocaleString()}\n\nVui lòng tham gia đúng giờ.\n\nTrân trọng,\nAdmin`;
            sendEmail(student.email, subject, text);
          });
    
          res.status(201).json({ message: "Cuộc họp đã được tạo", onlmeeting });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      },
    getMeetingsByClass: async (req, res) => {
        try {
          const { classId } = req.params;
          const onlmeetings = await OnlMeeting.find({ class: classId })
            .populate({ path: "class", select: "name" })
            .populate({ path: "attendees.student", select: "username email" });

    
          res.status(200).json({ onlmeetings });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      },
    markAttendance: async (req, res) => {
        try {
          const { meetingId } = req.params;
          const { studentIds } = req.body;
    
          const onlmeeting = await OnlMeeting.findById(meetingId);
          if (!onlmeeting) {
            return res.status(404).json({ message: "Cuộc họp không tồn tại" });
          }
    
          // Đánh dấu điểm danh
          onlmeeting.attendees.forEach(attendee => {
            if (studentIds.includes(attendee.student.toString())) {
              attendee.attended = true;
            } else {
              attendee.attended = false; 
            }
          });
          console.log("Updated attendees:", onlmeeting.attendees);
          await onlmeeting.save();
    
          res.status(200).json({ message: "Điểm danh thành công", onlmeeting });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      },
    getAllMeetings: async (req, res) => {
        try {
          const onlmeetings = await OnlMeeting.find()
            .populate({ path: "class", select: "name" })
            .populate({ path: "attendees.student", select: "username email" });
    
          res.status(200).json({ onlmeetings });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
}
 module.exports =  onlMeetingController ;