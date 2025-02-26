import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AdminState = {
  students: any[];
  tutors: any[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
};

const token = AsyncStorage.getItem("access-token");

// Create the admin store with persist and devtools middleware
export const useAdminStore = create<AdminState>()(
  // devtools(
  //   persist(
  (set) => ({
    students: [],
    tutors: [],
    loading: false,

    fetchUsers: async () => {
      set({ loading: true });
      try {
        const res = await axiosInstance.get("v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const students = res.data.filter((user: any) => user.role === "student");
        console.log("🚀 ~ fetchUsers: ~ students:", students)
        const tutors = res.data.filter((user: any) => user.role === "tutor");
        console.log("🚀 ~ fetchUsers: ~ tutors:", tutors)
        set({ students, tutors, loading: false });
      } catch (error: any) {
        set({ loading: false });
        console.log("🚀 ~ fetchUsers: ~ error:", error.response?.data?.message);
        Toast.show({
          type: "error",
          text1: "Failed to fetch users",
          text2: error.response?.data?.message,
        });
      }
    },
  })
  //     { name: "admin-store" }
  //   )
  // )
);
