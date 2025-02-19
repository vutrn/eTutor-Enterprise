const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 40,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
    },
    role: {
        type: String,
        enum: ["student", "tutor", "admin"],
        required: true,
        default: "student"
    }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);