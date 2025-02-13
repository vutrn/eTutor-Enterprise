import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  fetchUsers: async () => { },

  fetchMessages: async () => { },

  sendMessage: async (message) => { },

  
}));