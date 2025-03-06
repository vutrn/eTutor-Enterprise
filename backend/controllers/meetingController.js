const Meeting = require("../models/Meeting");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");

const meetingController = {
    createMeeting : async (req, res) => {
    try {
        const { title, date, location, participantIds } = req.body;
        const adminId = req.user.id;

        const participants = await User.find({ _id: { $in: participantIds } });
        if (participants.length !== participantIds.length) {
            return res.status(400).json({ message: "Một số người tham gia không hợp lệ" });
        }

        const newMeeting = new Meeting({
            title,
            date,
            location,
            organizer: adminId,
            participants: participantIds
        });
        await newMeeting.save();

        participants.forEach(user => {
            const subject = "Lời mời tham gia cuộc họp";
            const text = `Chào ${user.username},\n\nBạn đã được mời tham gia cuộc họp: "${title}"\n\n📅 Thời gian: ${new Date(date).toLocaleString()}\n📍 Địa điểm: ${location}\n\nTrân trọng,\nAdmin`;
            sendEmail(user.email, subject, text);
        });

        res.status(201).json({ message: "Cuộc họp đã được tạo và gửi lời mời", meeting: newMeeting });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}
}
 module.exports =  meetingController ;