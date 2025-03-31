import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { IMeetingState } from "../types/store";
import axiosInstance from "../utils/axios";
import { useClassStore } from "./useClassStore";

export const useMeetingStore = create<IMeetingState>((set) => ({
  meetings: [],
  loading: false,

  getOfflineMeetings: async () => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedClass } = useClassStore.getState();

      set({ loading: true });
      const res = await axiosInstance.get(`v1/meeting/${selectedClass._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ meetings: res.data.meetings, loading: false });
    } catch (error: any) {
      console.error("Error fetching meetings:", error.response?.data?.message);
      set({ loading: false });
    }
  },

  getOnlineMeetings: async () => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedClass } = useClassStore.getState();

      set({ loading: true });
      const res = await axiosInstance.get(`v1/onlmeeting/${selectedClass._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ meetings: res.data.meetings, loading: false });
    } catch (error: any) {
      console.error("Error fetching online meetings:", error.response?.data?.message);
      set({ loading: false });
    }
  },

  createOfflineMeeting: async (title, description, location, time) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedClass } = useClassStore.getState();

      set({ loading: true });

      const res = await axiosInstance.post(
        `v1/meeting`,
        { classId: selectedClass._id, title, description, location, time },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({ meetings: res.data.meetings, loading: false });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Offline meeting created successfully",
      });
    } catch (error: any) {
      console.error("Error creating offline meeting:", error.response?.data?.message);
      set({ loading: false });
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to create offline meeting",
      });
    }
  },

  createOnlineMeeting: async (title, linkggmeet, time) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedClass } = useClassStore.getState();

      set({ loading: true });

      const res = await axiosInstance.post(
        `v1/onlmeeting`,
        { classId: selectedClass._id, title, linkggmeet, time },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({ loading: false });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Online meeting created successfully",
      });

      return res.data.meeting;
    } catch (error: any) {
      console.error("Error creating online meeting:", error.response?.data?.message);
      set({ loading: false });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to create online meeting",
      });
    }
  },

  markOfflineAttendance: async (meetingId: string, studentIds: string[]) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      set({ loading: true });

      const res = await axiosInstance.put(
        `v1/meeting/attendance/${meetingId}`,
        { studentIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ loading: false });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Attendance marked successfully",
      });

      return res.data;
    } catch (error: any) {
      console.error("Error marking attendance:", error.response?.data?.message);
      set({ loading: false });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to mark attendance",
      });
    }
  },

  markOnlineAttendance: async (meetingId: string, studentIds: string[]) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      set({ loading: true });

      const res = await axiosInstance.put(
        `v1/onlmeeting/attendance/${meetingId}`,
        { studentIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ loading: false });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Attendance marked successfully",
      });

      return res.data;
    } catch (error: any) {
      console.error("Error marking attendance:", error.response?.data?.message);
      set({ loading: false });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to mark attendance",
      });
    }
  },
}));

// router.post("/", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.createOnlMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.markAttendance);

// router.post("/", middlewareController.verifyTokenAndAdminAndTutor, meetingController.createMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.markAttendance);
