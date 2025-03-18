import { create } from "zustand";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";
import { IBlogState } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useBlogStore = create<IBlogState>((set, get) => ({
  blogs: [],
  selectedBlog: {
    _id: "",
    title: "",
    content: "",
    author: {
      _id: "",
      username: "",
      email: "",
    },
    comments: [],
    createdAt: "",
    updatedAt: "",
  },

  setSelectedBlog: (selectedBlog: any) => set({ selectedBlog }),

  getAllBlogs: async () => {
    try {
      const res = await axiosInstance.get("v1/blog");
      set({ blogs: res.data.blogs });
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

  createBlog: async (image?: string, title: string, content: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");
      const res = await axiosInstance.post(
        `v1/blog/createblog`,
        { image, title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ blogs: res.data.blogs });
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to create blog" });
      console.log("🚀 ~ createBlog: ~ error:", error);
    }
  },

  updateBlog: async (blogId, title: string, content: string) => {},

  deleteBlog: async (blogId) => {},

  commentBlog: async (text: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedBlog } = get();

      const res = await axiosInstance.post(
        `v1/blog/${selectedBlog._id}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.blog) {
        set({ selectedBlog: { ...res.data.blog, comments: res.data.blog.comments } });
        return true;
      }
      return false;
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to comment on blog" });
      console.log("🚀 ~ commentBlog: ~ error:", error);
      return false;
    }
  },
}));

// router.post("/createblog", middlewareController.verifyToken, blogController.createBlog);

// router.get("/", blogController.getAllBlogs);

// router.get("/:blogId/getbyId", blogController.getBlogById);

// router.put("/:blogId/updateblog", middlewareController.verifyToken, blogController.updateBlog);

// router.delete("/:blogId", middlewareController.verifyToken, blogController.deleteBlog);

// router.post("/:blogId/comment", middlewareController.verifyToken, blogController.commentBlog);
