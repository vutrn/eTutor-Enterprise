import express from "express";
const router = express.Router();
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/commentControllers";

router
  .route("/")
  .post(createComment)
  .get(getAllComments);
router
  .route("/:commentId")
  .put(updateComment)
  .delete(deleteComment);

export default router;