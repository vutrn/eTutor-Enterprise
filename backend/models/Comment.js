import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        desc: { type: String, required: true },
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

CommentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parent",
});

const Comment = model("Comment", CommentSchema);
export default Comment;
