const Blog = require("../models/Blog");
const User = require("../models/User");
const Cloudinary = require("../lib/cloudinary.js");

const blogController = {

    createBlog: async (req, res) => {
        try {
            const { title, content, image } = req.body;
            const author = req.user.id;

            let imageUrl = "";
            if (image) {
            const uploadResponse = await Cloudinary.uploader.upload(image, {folder: "blogs"});
            imageUrl = uploadResponse.secure_url;
            }
            const newBlog = new Blog({ title, content, author, image: imageUrl});
            await newBlog.save();

            res.status(201).json({ message: "Blog đã được tạo", blog: newBlog });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Lấy danh sách bài viết
    getAllBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find().populate("author", "username email");
            res.status(200).json({ blogs });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách blog", error: error.message });
        }
    },

    // Lấy một bài viết theo ID
    getBlogById: async (req, res) => {
        try {
            const { blogId } = req.params;
            const blog = await Blog.findById(blogId).populate("author", "username email");
            if (!blog) return res.status(404).json({ message: "Blòg không tồn tại" });

            res.status(200).json({ blog });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Cập nhật bài viết
    updateBlog: async (req, res) => {
        try {
            const { blogId } = req.params;
            const { title, content, image } = req.body;

            const blog = await Blog.findById(blogId);
            if (!blog) return res.status(404).json({ message: "Blog không tồn tại" });

            if (blog.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa blog này" });
            }

             // Nếu có image mới, upload lên Cloudinary
            let imageUrl = blog.image; // Giữ nguyên ảnh cũ nếu không có ảnh mới
            if (image) {
            const uploadResponse = await Cloudinary.uploader.upload(image, {folder: "blogs"});
            imageUrl = uploadResponse.secure_url;
            }

            // Cập nhật dữ liệu
            blog.title = title || blog.title;
            blog.content = content || blog.content;
            blog.image = imageUrl;

            await blog.save();

            res.status(200).json({ message: "Blog đã được cập nhật", blog });
            } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
            }
        },

    // Xóa bài viết
    deleteBlog: async (req, res) => {
        try {
            const { blogId } = req.params;

            const blog = await Blog.findById(blogId);
            if (!blog) return res.status(404).json({ message: "Blog không tồn tại" });

            if (blog.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "Bạn không có quyền xóa blog này" });
            }

            await blog.deleteOne();
            res.status(200).json({ message: "Blog đã bị xóa" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Bình luận bài viết
    commentBlog: async (req, res) => {
        try {
            const { blogId } = req.params;
            const { text } = req.body;
            const userId = req.user.id;

            const blog = await Blog.findById(blogId);
            if (!blog) return res.status(404).json({ message: "Bài viết không tồn tại" });

            blog.comments.push({ user: userId, text });
            await blog.save();

            res.status(200).json({ message: "Comment đã được thêm", blog });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = blogController;
