import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { IMeetingState } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useMeetingStore = create<IMeetingState>((set) => ({
  meetings: [],
  loading: false,

  getMeetingsByClass: async (classId: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      set({ loading: true });
      const res = await axiosInstance.get(`v1/meeting/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ meetings: res.data.meetings, loading: false });
    } catch (error: any) {
      console.error("Error fetching meetings:", error.response?.data?.message);
      set({ loading: false });
    }
  },

  createMeeting: async (meetingData) => {},

  markAttendance: async (meetingId: string, studentIds: string[]) => {},
}));

// router.post("/", middlewareController.verifyTokenAndAdmin, meetingController.createMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdmin, meetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.markAttendance);
