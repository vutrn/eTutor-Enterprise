import express from "express";
const router = express.Router();
import {
    createPost,
    deletePost,
    getAllPosts,
    getPost,
    updatePost,
} from "../controllers/postControllers";

router.route("/").post(createPost).get(getAllPosts);
router
    .route("/:slug")
    .put(updatePost)
    .delete(deletePost)
    .get(getPost);

export default router;