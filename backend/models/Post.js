const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        caption: { type: String, required: true },
        body: { type: Object, required: true },
        photo: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);