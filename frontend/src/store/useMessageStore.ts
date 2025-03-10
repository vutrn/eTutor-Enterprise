import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import axiosInstance from "../utils/axios";



interface MessageState {
  messages: any[];
  users: any[];
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  getUsersToChat: (classId: string) => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  sendMessage: ( messageData: any) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  setSelectedUser: (user: any) => set({ selectedUser: user }),

  getUsersToChat: async (classId) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get(`v1/message/users/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: res.data });
      console.log("🚀 ~ getUsersToChat: ~ res.data:", res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  getMessages: async (receiverId: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get(`v1/message/getmessage/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ messages: res.data });
      console.log("🚀 ~ getMessages: ~ res.data:", res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },

  sendMessage: async (messageData: any) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedUser } = get();

      const res = await axiosInstance.post(`v1/message/sendmessage/${selectedUser._id}`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ messages: [...get().messages, res.data] });
      console.log("🚀 ~ sendMessage: ~ res:", res);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
}));
