const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    organizer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    }, // Admin tạo cuộc họp
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }] // Danh sách người tham gia
}, { timestamps: true });

module.exports = mongoose.model("Meeting", MeetingSchema);