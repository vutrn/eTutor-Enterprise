const User = require("../models/User");
const PersonalClassroom = require("../models/PersonalClass");

const dashboardController = {
    getDashboard: async(req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) return res.status(404).json({ error: "User not found" });

            if (user.role === "admin") {
                // Admin: Lấy tổng số người dùng và phân loại theo role
                const totalUsers = await User.countDocuments();
                const studentsCount = await User.countDocuments({ role: "student" });
                const tutorsCount = await User.countDocuments({ role: "tutor" });

                return res.status(200).json({ role: "admin", totalUsers, studentsCount, tutorsCount });
            }

            if (user.role === "tutor") {
                // Tutor: Lấy số lớp đang tham gia và tổng số học sinh của các lớp đó
                const classes = await PersonalClassroom.find({ tutor: userId }).populate("students", "username");
                const totalClasses = classes.length;
                const totalStudents = classes.reduce((acc, cls) => acc + cls.students.length, 0);

                return res.status(200).json({ role: "tutor", totalClasses, totalStudents, classes });
            }

            if (user.role === "student") {
                // Student: Lấy danh sách lớp và tutor của lớp đó
                const classes = await PersonalClassroom.find({ students: userId }).populate("tutor", "username");

                return res.status(200).json({ role: "student", classes });
            }

            return res.status(403).json({ error: "Invalid role" });

        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}

module.exports = dashboardController;