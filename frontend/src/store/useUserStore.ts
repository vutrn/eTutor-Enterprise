import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { IUserState, User } from "../types/store";
import axiosInstance from "../utils/axios";

export const useUserStore = create<IUserState>(
  // devtools(
  //   persist(
  (set) => ({
    students: [],
    tutors: [],
    users: [],
    loading: false,

    getUsers: async () => {
      try {
        const token = await AsyncStorage.getItem("access-token");
        if (!token) {
          set({ loading: false });
          throw new Error("No token found");
        }

        const res = await axiosInstance.get("v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const students = res.data.filter((user: User) => user.role === "student");
        const tutors = res.data.filter((user: User) => user.role === "tutor");
        const filteredUsers = res.data.filter((user: User) => user.role !== "admin");
        set({ students, tutors, users: filteredUsers, loading: false });
        // set({ students, tutors, users: res.data, loading: false });
      } catch (error: any) {
        set({ loading: false });
        console.log("🚀 ~ fetchUsers: ~ error:", error.response?.data?.message);
        Toast.show({
          type: "error",
          text1: "Failed to fetch users",
          text2: error.response?.data?.message || "An error occurred",
        });
      }
    },

    deleteUser: async (userId: string) => {
      try {
        const token = await AsyncStorage.getItem("access-token");
        if (!token) {
          throw new Error("No token found");
        }
        await axiosInstance.delete(`v1/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Toast.show({ type: "success", text1: "User deleted successfully" });
      } catch {
        Toast.show({ type: "error", text1: "Failed to delete user" });
      }
    },

  })
  //     { name: "admin-store" }
  //   )
  // )
);
