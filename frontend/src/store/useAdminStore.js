import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../libs/axios";

export const useAdminStore = create((set) => ({
  users: [],
  isUsersLoading: false,

  getAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("v1/user", {
        headers: {
          token: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      set({ users: res.data });
      console.log("users", res);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));
