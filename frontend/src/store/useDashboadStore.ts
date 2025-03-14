import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { create } from "zustand";
import axiosInstance from "../utils/axios";

type DashboardState = {
  dashboard: {
    role?: "admin" | "tutor" | "student";
    totalClasses?: number;
    totalStudents?: number;
    classes?: {
      _id: string;
      name: string;
      tutor: string;
      students: {
        _id: string;
        username: string;
      }[];
      admin: string;
      createdAt: string;
    }[];
  };

  getDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>()((set) => ({
  dashboard: {
    role: undefined,
    totalClasses: 0,
    totalStudents: 0,
    classes: [],
  },

  getDashboard: async () => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axiosInstance.get("v1/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ dashboard: res.data });
      // console.log("🚀 ~ getDashboard: ~ res.data:", res.data);
    } catch (error) {
      console.log("🚀 ~ getDashboard: ~ error:", error);
      Toast.show({ type: "error", text1: "Failed to get dashboard" });
    }
  },
}));
