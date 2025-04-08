import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { IMessageState, Message, User } from "../types/store";
import axiosInstance from "../utils/axios";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create<IMessageState>((set, get) => ({
  messages: [] as Message[],
  users: [
    {
      _id: "",
      username: "",
      email: "",
      role: "",
      createdAt: "",
    },
  ],
  selectedUser: {
    _id: "",
    username: "",
    email: "",
    role: "",
  },

  setSelectedUser: (selectedUser: any) => {
    set({ selectedUser });
    set({ messages: [] });
    if (selectedUser?._id) {
      get().getMessages(selectedUser._id);
    }
  },

  getUsersToChat: async (classId) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get(`v1/message/users/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Users to chat:", res.data);
      const { authUser } = useAuthStore.getState();
      const filteredUsers = res.data.filter(
        (user: User) => user._id !== authUser?._id && user.role !== "admin",
      );
      set({ users: filteredUsers });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error fetching users",
        text2: error?.message,
      });
      console.error("Error fetching users:", error);
    }
  },

  getMessages: async (receiverId: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get(
        `v1/message/getmessage/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      set({ messages: res.data });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error fetching messages",
        text2: error.response?.data?.message || "Failed to fetch messages",
      });
      console.error("Error fetching messages:", error);
    }
  },

  sendMessage: async (messageData: { text: string; image?: string }) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      const { selectedUser, messages } = get();
      const { socket } = useAuthStore.getState();

      const res = await axiosInstance.post(
        `v1/message/sendmessage/${selectedUser._id}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update local message list immediately for better UX
      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send message",
        text2: error.response?.data?.message || "Please try again",
      });
    }
  },

  subscribeToMessages: () => {
    const { socket } = useAuthStore.getState();
    const { selectedUser } = get();

    if (!socket) return;

    socket.on("newMessage", (newMessage: any) => {
      if (newMessage.senderId !== selectedUser._id) return;
      const { messages } = get();
      const updatedMessages = [...messages, newMessage];
      set({ messages: updatedMessages });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    socket.off("newMessage");
  },
}));
