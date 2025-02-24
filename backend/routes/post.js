const postController = require("../controllers/postController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/", middlewareController.veriryToken, postController.createPost);

router.get("/", postController.getAllPosts);

router.get("/:id", postController.getPost);

router.put("/:id", middlewareController.veriryToken, postController.updatePost);

router.delete("/:id", middlewareController.veriryToken, postController.deletePost);

module.exports = router;
