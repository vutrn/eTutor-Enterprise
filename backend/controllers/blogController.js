const Blog = require("../models/Blog");
const User = require("../models/User");
const Cloudinary = require("../lib/cloudinary.js");
const sendEmail = require("../lib/emailService");

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
        if (image) {
            const uploadResponse = await Cloudinary.uploader.upload(image, { folder: "blogs" });
            blog.image = uploadResponse.secure_url;
        }
        if (title) blog.title = title;
        if (content) blog.content = content;
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
    
            const blog = await Blog.findById(blogId).populate("author", "email username");
            if (!blog) return res.status(404).json({ message: "Bài viết không tồn tại" });
    
            // Thêm bình luận vào danh sách
            blog.comments.push({ user: userId, text });
            await blog.save();
    
            // Gửi email thông báo đến tác giả bài viết
            const subject = "Có một bình luận mới trên bài viết của bạn!";
            const message = `Xin chào ${blog.author.username},\n\n` +
                            `Người dùng đã để lại bình luận trên bài viết "${blog.title}":\n\n` +
                            `"${text}"`;
    
            await sendEmail(blog.author.email, subject, message);
    
            res.status(200).json({ message: "Comment đã được thêm và thông báo đã gửi", blog });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = blogController;
