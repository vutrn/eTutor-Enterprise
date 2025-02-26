import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type AdminState = {
  students: any[];
  tutors: any[];
  loading: boolean;
  isTokenExpired: boolean;
  fetchUsers: () => Promise<void>;
};

// Create the admin store with persist and devtools middleware
export const useAdminStore = create<AdminState>()(
  // devtools(
  //   persist(
  (set) => ({
    students: [],
    tutors: [],
    loading: false,
    isTokenExpired: false,

    fetchUsers: async () => {
      set({ loading: true });
      try {
        const token = await AsyncStorage.getItem("access-token");
        if (!token) {
          set({ loading: false });
          throw new Error("No token found");
        }

        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          Toast.show({
            type: "error",
            text1: "Token expired",
            text2: "Please log in again",
          });
          set({ loading: false, isTokenExpired: true });
          return;
        }
        const res = await axiosInstance.get("v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const students = res.data.filter((user: any) => user.role === "student");
        const tutors = res.data.filter((user: any) => user.role === "tutor");
        // console.log("🚀 ~ fetchUsers: ~ students:", students)
        // console.log("🚀 ~ fetchUsers: ~ tutors:", tutors)
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
  })
  //     { name: "admin-store" }
  //   )
  // )
);
