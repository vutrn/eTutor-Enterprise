import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../libs/axios";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in user checkAuth:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("v1/auth/register", formData);
      console.log("res", res);
      set({ authUser: res.data });
      console.log("authUser", res.data);
      toast.success("Signup successful");
    } catch (error) {
      console.error("Signup failed:", error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/v1/auth/login", formData);
      set({ authUser: res.data });
    } catch (error) {
      console.error("Login error:", error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateAccessToken: (newToken) => set({ accessToken: newToken }),

  refreshAccessToken: async () => {
    try {
      const refreshToken = get().refreshToken;
      const response = await axiosInstance.post("/api/auth/refresh-token", { refreshToken });
      set({ accessToken: response.data.accessToken });
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  },

  logout: () => set({ user: null, accessToken: null, refreshToken: null }),

  updateProfile: async (formData) => {},

  connectSocket: async () => {},

  disconnectSocket: async () => {},
}));
