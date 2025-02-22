const { v4: uuidv4 } = require("uuid");
const Post = require("../models/Post");
const { fileRemover } = require("../utils/fileRemover");

const postController = {
    // Create a Post
    createPost: async (req, res, next) => {
        try {
            const post = new Post({
                title: "sample",
                caption: "sample",
                slug: uuidv4(),
                body: {
                    type: "doc",
                    content: [],
                },
                photo: "",
                user: req.user._id,
            });

            const createdPost = await post.save();
            return res.json(createdPost);
        } catch (error) {
            next(error);
        }
    },

    // Update a Post
    updatePost: async (req, res, next) => {
        try {
            const post = await Post.findOne({ slug: req.params.slug });

            if (!post) {
                return next(new Error("Post not found"));
            }

            const upload = uploadPicture.single("postPicture");

            const handleUpdatePostData = async (data) => {
                const { title, caption, slug, body } = JSON.parse(data);
                post.title = title || post.title;
                post.caption = caption || post.caption;
                post.slug = slug || post.slug;
                post.body = body || post.body;
                const updatedPost = await post.save();
                return res.json(updatedPost);
            };

            upload(req, res, async function (err) {
                if (err) {
                    return next(new Error("Error uploading file: " + err.message));
                } 
                
                if (req.file) {
                    fileRemover(post.photo);
                    post.photo = req.file.filename;
                } else {
                    fileRemover(post.photo);
                    post.photo = "";
                }
                
                handleUpdatePostData(req.body.document);
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete a Post
    deletePost: async (req, res, next) => {
        try {
            const post = await Post.findOneAndDelete({ slug: req.params.slug });

            if (!post) {
                return next(new Error("Post not found"));
            }

            fileRemover(post.photo);

            return res.json({
                message: "Post is deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    // Get a Single Post
    getPost: async (req, res, next) => {
        try {
            const post = await Post.findOne({ slug: req.params.slug }).populate([
                {
                    path: "user",
                    select: ["avatar", "name"],
                },
            ]);

            if (!post) {
                return next(new Error("Post not found"));
            }

            return res.json(post);
        } catch (error) {
            next(error);
        }
    },

    // Get All Posts with Pagination & Search
    getAllPosts: async (req, res, next) => {
        try {
            const filter = req.query.searchKeyword;
            let where = filter ? { title: { $regex: filter, $options: "i" } } : {};

            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * pageSize;

            const total = await Post.countDocuments(where);
            const pages = Math.ceil(total / pageSize);

            res.header({
                "x-filter": filter,
                "x-totalcount": JSON.stringify(total),
                "x-currentpage": JSON.stringify(page),
                "x-pagesize": JSON.stringify(pageSize),
                "x-totalpagecount": JSON.stringify(pages),
            });

            if (page > pages) return res.json([]);

            const result = await Post.find(where)
                .skip(skip)
                .limit(pageSize)
                .populate([
                    {
                        path: "user",
                        select: ["avatar", "name", "verified"],
                    },
                ])
                .sort({ updatedAt: "desc" });

            return res.json(result);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = postController;