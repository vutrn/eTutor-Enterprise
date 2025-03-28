const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PersonalClassroom", 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  location: { 
    type: String, 
    required: true 
  },
  time: { 
    type: Date, 
    required: true 
  },
  attendees: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      attended: { type: Boolean, default: false }
    }
  ],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Meeting", MeetingSchema);