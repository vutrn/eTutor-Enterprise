import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import axiosInstance from "../utils/axios";

type ClassState = {
  classes: any[];
  loading: boolean;

  fetchClasses: () => Promise<void>;
  createClass: (name: string, tutorId: string, studentIds: string[]) => Promise<boolean>;
  updateClass: (
    classId: string,
    name: string,
    tutorId: string,
    studentIds: string[]
  ) => Promise<boolean>;
  deleteClass: (classId: string) => Promise<boolean>;
  addStudentsToClass: (classId: string, studentIds: string[]) => Promise<boolean>;
  removeStudentFromClass: (classId: string, studentId: string) => Promise<boolean>;
};

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  loading: false,

  fetchClasses: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        set({ loading: false });
        return;
      }

      const res = await axiosInstance.get("v1/class", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        classes: res.data.personalClasses,
        loading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch classes:", error);
      set({ loading: false });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to fetch classes",
      });
    }
  },

  createClass: async (name, tutorId, studentIds) => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        set({ loading: false });
        return false;
      }

      await axiosInstance.post(
        "v1/class/createclass",
        { name, tutorId, studentIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh classes after creation
      await get().fetchClasses();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Class created successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Failed to create class:", error);
      set({
        loading: false,
      });

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to create class",
      });

      return false;
    }
  },

  updateClass: async (classId, name, tutorId, studentIds) => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        set({ loading: false });
        return false;
      }

      // Update class name
      await axiosInstance.put(
        `v1/class/${classId}/updatename`,
        { newName: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update tutor if provided
      if (tutorId) {
        await axiosInstance.put(
          `v1/class/${classId}/changetutor`,
          { tutorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Add students if provided
      if (studentIds && studentIds.length > 0) {
        await axiosInstance.put(
          `v1/class/${classId}/addstudent`,
          { studentIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh classes after update
      await get().fetchClasses();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Class updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Failed to update class:", error);
      set({ loading: false });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to update class",
      });
      return false;
    }
  },

  deleteClass: async (classId) => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        set({ loading: false });
        return false;
      }

      await axiosInstance.delete(`v1/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh classes after creation
      await get().fetchClasses();

      Toast.show({ type: "success", text1: "Success", text2: "Class deleted successfully" });

      return true;
    } catch (error: any) {
      console.error("Failed to delete class:", error);
      set({ loading: false });

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to delete class",
      });

      return false;
    }
  },

  addStudentsToClass: async (classId, studentIds) => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        set({ loading: false });
        return false;
      }

      await axiosInstance.put(
        `v1/personalclass/${classId}/addstudent`,
        { studentIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh classes after adding students
      await get().fetchClasses();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Students added successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Failed to add students:", error);
      set({
        loading: false,
      });

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to add students",
      });

      return false;
    }
  },

  removeStudentFromClass: async (classId, studentId) => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) {
        set({ loading: false });
        return false;
      }

      await axiosInstance.delete(`v1/personalclass/${classId}/deletestudent/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh classes after removing student
      await get().fetchClasses();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Student removed successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Failed to remove student:", error);
      set({ loading: false });

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to remove student",
      });

      return false;
    }
  },
}));
