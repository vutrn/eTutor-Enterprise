import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "./useAuthStore";

type AdminState = {
  students: any[];
  tutors: any[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
};

export const useAdminStore = create<AdminState>()(
  // devtools(
  //   persist(
  (set) => ({
    students: [],
    tutors: [],
    loading: false,

    fetchUsers: async () => {
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
        const students = res.data.filter((user: any) => user.role === "student");
        const tutors = res.data.filter((user: any) => user.role === "tutor");
        set({ students, tutors, loading: false });
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
