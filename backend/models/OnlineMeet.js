const mongoose = require("mongoose");

const OnlineMeetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    meetLink: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("OnlineMeet", OnlineMeetSchema);
