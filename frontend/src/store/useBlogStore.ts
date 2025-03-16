import { create } from "zustand";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";
import { IBlogState } from "../types/store";

export const useBlogStore = create<IBlogState>((set, get) => ({
  blogs: [],

  getAllBlogs: async () => {
    try {
      const res = await axiosInstance.get("v1/blog/");
      set({ blogs: res.data });

      console.log("🚀 ~ getAllBlogs: ~ res.data:", res.data);
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to get blogs" });
      console.log("🚀 ~ getAllBlogs: ~ error:", error);
    }
  },

  getBlogById: async (blogId) => {
    try {
      const res = await axiosInstance.get(`v1/blog/${blogId}/getbyId`);
      set({ blogs: res.data });
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to get blog by ID" });
      console.log("🚀 ~ getBlogById: ~ error:", error);
    }
  },

  createBlog: async (title: string, content: string) => {

    return true;
  },

  updateBlog: async (blogId, title: string, content: string) => {

    return true;
  },

  deleteBlog: async(blogId) => {
    
    return true;
  },
}));

// router.post("/createblog", middlewareController.verifyToken, blogController.createBlog);

// router.get("/", blogController.getAllBlogs);

// router.get("/:blogId/getbyId", blogController.getBlogById);

// router.put("/:blogId/updateblog", middlewareController.verifyToken, blogController.updateBlog);

// router.delete("/:blogId", middlewareController.verifyToken, blogController.deleteBlog);

// router.post("/:blogId/comment", middlewareController.verifyToken, blogController.commentBlog);
