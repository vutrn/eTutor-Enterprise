const postController = require("../controllers/postController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/", middlewareController.veriryToken, postController.createPost);

router.get("/", postController.getAllPosts);

router.get("/:slug", postController.getPost);

router.put("/:slug", middlewareController.veriryToken, postController.updatePost);

router.delete("/:slug", middlewareController.veriryToken, postController.deletePost);

module.exports = router;