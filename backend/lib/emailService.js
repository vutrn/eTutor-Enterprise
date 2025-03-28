require("dotenv").config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async(to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Admin" <${process.env.EMAIL_ADMIN}>`,
            to,
            subject,
            text
        });

        console.log(`Email đã gửi đến: ${to}`);
    } catch (error) {
        console.error(" Lỗi gửi email:", error);
    }
};

module.exports = sendEmail;