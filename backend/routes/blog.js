const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const blogController = require("../controllers/blogController");

router.post("/createblog", middlewareController.verifyToken, blogController.createBlog);

router.get("/", blogController.getAllBlogs);

router.get("/:blogId/getbyId", blogController.getBlogById);

router.put("/:blogId/updateblog", middlewareController.verifyToken, blogController.updateBlog);

router.delete("/:blogId", middlewareController.verifyToken, blogController.deleteBlog);

router.post("/:blogId/comment", middlewareController.verifyToken, blogController.commentBlog);

module.exports = router;