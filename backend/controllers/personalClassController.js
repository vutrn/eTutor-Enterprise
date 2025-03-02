const PersonalClass = require("../models/PersonalClass");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");

const personalClassController = {

    createPersonalClass: async(req, res) => {
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

            students.forEach(student => {
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

    addStudentsToClass: async(req, res) => {
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

            // Lọc ra những học sinh chưa có trong lớp
            const existingStudentIds = new Set(personalClass.students.map(id => id.toString()));
            const newStudents = students.filter(student => !existingStudentIds.has(student._id.toString()));

            if (newStudents.length === 0) {
                return res.status(400).json({ message: "Tất cả học sinh đã có trong lớp" });
            }

            // Thêm học sinh vào lớp
            personalClass.students.push(...newStudents.map(student => student._id));
            await personalClass.save();

            // Gửi email chỉ cho những học sinh mới được thêm vào
            newStudents.forEach(student => {
                const subject = "Bạn đã được thêm vào lớp học";
                const text = `Chào ${student.username},\n\nBạn đã được thêm vào lớp "${personalClass.name}".\n\nHãy chuẩn bị học tập thật tốt nhé!\n\nTrân trọng,\nAdmin`;

                sendEmail(student.email, subject, text);
            });

            res.status(200).json({ message: "Danh sách học sinh đã được cập nhật", personalClass });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deletePersonalClass: async(req, res) => {
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

    removeStudentFromClass: async(req, res) => {
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
    },

    changeTutorClass: async (req, res) => {
        try {
            const { personalClassId } = req.params;
            const { newTutorId } = req.body;
    
            const personalClass = await PersonalClass.findById(personalClassId);
            if (!personalClass) return res.status(404).json({ message: "Lớp học không tồn tại" });
            const newTutor = await User.findById(newTutorId);
            if (!newTutor || newTutor.role !== "tutor") {
                return res.status(400).json({ message: "Gia sư không hợp lệ" });
            }
    
            personalClass.tutor = newTutorId;
            await personalClass.save();
    
            // Gửi email thông báo cho tutor mới
            const subject = "Bạn đã được phân công làm gia sư";
            const text = `Chào ${newTutor.username},\n\nBạn đã được chỉ định làm gia sư cho lớp "${personalClass.name}".\n\nHãy chuẩn bị hướng dẫn các học sinh nhé!\n\nTrân trọng,\nAdmin`;
    
            sendEmail(newTutor.email, subject, text);
    
            res.status(200).json({ message: "Gia sư đã được cập nhật", personalClass });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateClassName: async (req, res) => {
        try {
            const { personalClassId } = req.params;
            const { newName } = req.body;
    
            if (!newName || newName.trim() === "") {
                return res.status(400).json({ message: "Tên lớp mới không hợp lệ" });
            }
    
            const personalClass = await PersonalClass.findById(personalClassId);
            if (!personalClass) {
                return res.status(404).json({ message: "Lớp học không tồn tại" });
            }

            personalClass.name = newName.trim();
            await personalClass.save();
    
            res.status(200).json({ message: "Tên lớp đã được cập nhật", personalClass });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },


}



module.exports = personalClassController