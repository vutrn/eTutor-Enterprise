const mongoose = require("mongoose");

const PersonalClassSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  tutor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("PersonalClassroom", PersonalClassSchema);
