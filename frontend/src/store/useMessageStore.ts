import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { useAuthStore } from "./useAuthStore";

interface MessageState {
  messages: {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image: string;
    createdAt: string;
    updatedAt: string;
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
      _id: "",
      senderId: "",
      receiverId: "",
      text: "",
      image: "",
      createdAt: "",
      updatedAt: "",
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

      const { authUser } = useAuthStore.getState();
      const filteredUsers = res.data.filter((user: any) => user._id !== authUser._id);
      set({ users: filteredUsers });
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
