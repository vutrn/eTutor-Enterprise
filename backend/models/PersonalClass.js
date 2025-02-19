const mongoose = require("mongoose");

const PersonalClassSchema = new mongoose.Schema({
  classname: { 
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
});

module.exports = mongoose.model("PersonalClassroom", PersonalClassSchema);
