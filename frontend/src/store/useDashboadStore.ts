import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { IDashboardState } from "../types/store";

export const useDashboardStore = create<IDashboardState>((set, get) => ({
  dashboard: {
    role: undefined,
    totalClasses: 0,
    totalStudents: 0,
    classes: [],
  },
  classDocuments: {},
  classAttendance: {},

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
      // Toast.show({ type: "error", text1: "Failed to get dashboard" });
    }
  },
  getClassDocuments: async (classId: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axiosInstance.get(`v1/document/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        classDocuments: {
          ...state.classDocuments,
          [classId]: res.data.documents,
        },
      }));

      return res.data.documents;
    } catch (error) {
      console.log("🚀 ~ getClassDocuments: ~ error:", error);
      return [];
    }
  },

  getAllClassDocuments: async () => {
    const { dashboard } = get();
    if (!dashboard.classes || dashboard.classes.length === 0) return;

    for (const classItem of dashboard.classes) {
      await get().getClassDocuments(classItem._id);
    }
  },

  getClassAttendance: async (classId: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axiosInstance.get(`v1/meeting/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        classAttendance: {
          ...state.classAttendance,
          [classId]: res.data.meetings,
        },
      }));

      return res.data.meetings;
    } catch (error) {
      console.log("🚀 ~ getClassAttendance: ~ error:", error);
      return [];
    }
  },

  getAllClassesAttendance: async () => {
    const { dashboard } = get();
    if (!dashboard.classes || dashboard.classes.length === 0) return;

    for (const classItem of dashboard.classes) {
      await get().getClassAttendance(classItem._id);
    }
  },
}));
