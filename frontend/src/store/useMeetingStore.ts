import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { IMeetingState, OfflineMeeting, OnlineMeeting } from "../types/store";
import axiosInstance from "../utils/axios";
import { useClassStore } from "./useClassStore";

export const useMeetingStore = create<IMeetingState>((set) => ({
  offlineMeetings: [] as OfflineMeeting[],
  onlineMeetings: [] as OnlineMeeting[],
  selectedMeeting: {} as OfflineMeeting | OnlineMeeting,
  loading: false,

  setSelectedMeeting: (selectedMeeting) => set({ selectedMeeting }),

  getOfflineMeetings: async () => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedClass } = useClassStore.getState();

      set({ loading: true });
      const res = await axiosInstance.get(`v1/meeting/${selectedClass._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ offlineMeetings: res.data.meetings, loading: false });
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
      const res = await axiosInstance.get(
        `v1/onlmeeting/${selectedClass._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      set({ onlineMeetings: res.data.onlmeetings, loading: false });
    } catch (error: any) {
      console.error(
        "Error fetching online meetings:",
        error.response?.data?.message,
      );
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
        },
      );
      
      // Fetch updated offline meetings list
      const refreshRes = await axiosInstance.get(
        `v1/meeting/${selectedClass._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      
      // Update the state with the refreshed list
      set({ offlineMeetings: refreshRes.data.meetings || [], loading: false });
      
      return res.data.meeting;
    } catch (error: any) {
      console.error(
        "Error creating offline meeting:",
        error.response?.data?.message,
      );
      set({ loading: false });
      throw error; // Re-throw the error so we can handle it in the component
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
        },
      );
      
      // Fetch updated online meetings list
      const refreshRes = await axiosInstance.get(
        `v1/onlmeeting/${selectedClass._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      
      // Update the state with the refreshed list
      set({ onlineMeetings: refreshRes.data.onlmeetings || [], loading: false });
      
      return res.data.meeting;
    } catch (error: any) {
      console.error(
        "Error creating online meeting:",
        error.response?.data?.message,
      );
      set({ loading: false });
      throw error; // Re-throw the error so we can handle it in the component
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh meetings data after updating attendance
      const { selectedClass } = useClassStore.getState();
      const refreshRes = await axiosInstance.get(
        `v1/meeting/${selectedClass._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      set({ offlineMeetings: refreshRes.data.meetings, loading: false });
      return res.data;
    } catch (error: any) {
      console.error("Error marking attendance:", error.response?.data?.message);
      set({ loading: false });
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh meetings data after updating attendance
      const { selectedClass } = useClassStore.getState();
      const refreshRes = await axiosInstance.get(
        `v1/onlmeeting/${selectedClass._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      set({ onlineMeetings: refreshRes.data.onlmeetings, loading: false });
      return res.data;
    } catch (error: any) {
      console.error("Error marking attendance:", error.response?.data?.message);
      set({ loading: false });
    }
  },
}));

// router.post("/", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.createOnlMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.markAttendance);

// router.post("/", middlewareController.verifyTokenAndAdminAndTutor, meetingController.createMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.markAttendance);
