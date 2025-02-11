import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignningUp: false,
  isLoggingIn: false,

  isCheckingAuth: true,

  checkAuth: async () => { },
  
  signup: async (formData) => { },

  login: async (formData) => { },

  logout: async () => { },

  updateProfile: async (formData) => { },

  connectSocket: async () => { },

  disconnectSocket: async () => { },
}))