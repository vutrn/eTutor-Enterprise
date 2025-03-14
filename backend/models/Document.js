const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
