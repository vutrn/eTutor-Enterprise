import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import axiosInstance from "../utils/axios";

interface MessageState {
  messages: {
    senderId: string;
    receiverId: string;
    text: string;
    createdAt: string;
  }[];
  users: any[];
  selectedUser: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };

  setSelectedUser: (selectedUser: any) => void;
  getUsersToChat: (classId: string) => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [
    {
      senderId: "",
      receiverId: "",
      text: "",
      createdAt: "",
    },
  ],
  users: [],
  selectedUser: {
    _id: "",
    username: "",
    email: "",
    role: "",
  },

  setSelectedUser: (selectedUser: any) => set({ selectedUser }),

  getUsersToChat: async (classId) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get(`v1/message/users/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filteredUsers = res.data.filter((user: any) => user._id !== get().selectedUser._id);
      set({ users: filteredUsers });

      // console.log("🚀 ~ getUsersToChat: ~ res.data:", res.data);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error fetching users", text2: error?.message });
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
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error fetching messages", text2: error.response });
      console.error("Error fetching messages:", error);
    }
  },

  sendMessage: async (messageData: any) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedUser, messages } = get();

      const res = await axiosInstance.post(
        `v1/message/sendmessage/${selectedUser._id}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ messages: [...messages, res.data] });
      console.log("🚀 ~ sendMessage: ~ res:", res);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
}));
