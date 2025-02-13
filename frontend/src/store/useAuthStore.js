import { create } from "zustand";
import instance from "../pages/lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false, 
  isLoggingIn: false,
  isCheckingAuth: true,

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await instance.post("v1/auth/register", formData);
      console.log("res", res);
      set({ authUser: res.user });
      console.log("authUser", res.user);
      toast.success("Signup successful");
    } catch (error) {
      console.error("Signup failed:", error.message);
      toast.error("Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await instance.post("v1/auth/login", formData);
      console.log("login res:", res);
      set({ authUser: res.data });
      toast.success("Login successful");
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error("Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {},

  updateProfile: async (formData) => {},

  connectSocket: async () => {},

  disconnectSocket: async () => {},
}));
