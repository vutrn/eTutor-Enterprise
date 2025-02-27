import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";
import { jwtDecode } from "jwt-decode";
import { useAdminStore } from "./useAdminStore";

interface AuthState {
  authUser: any;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  accessToken: string | null;
  isTokenExpired: boolean;

  signup: (formData: any) => Promise<boolean>;
  login: (formData: any) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      accessToken: null,
      isTokenExpired: false,

      signup: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("v1/auth/register", formData);

          console.log("Signup successful:", res.data);
          Toast.show({ type: "success", text1: "Signup successful", text2: "Welcome!" });
          return true;
        } catch (error: any) {
          console.log("Signup failed:", error.response?.data?.message);
          Toast.show({
            type: "error",
            text1: "Signup failed",
            text2: error.response?.data?.message,
          });
          return false;
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (formData) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("v1/auth/login", formData);
          await AsyncStorage.setItem("access-token", res.data.accessToken);

          set({ authUser: res.data, isTokenExpired: false });

          return true;
        } catch (error: any) {
          console.log("🚀 ~ login: ~ error:", error.response?.data?.message);
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: error.response?.data?.message,
          });
          return false;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("v1/auth/logout");
          await AsyncStorage.removeItem("access-token");
          set({ authUser: null, accessToken: null, isTokenExpired: false });
          Toast.show({ type: "success", text1: "Logged out", text2: "See you soon!" });
        } catch (error: any) {
          console.log(error.response?.data?.message);
        }
      },

      verifyToken: async () => {
        try {
          const token = await AsyncStorage.getItem("access-token");
          if (!token) {
            Toast.show({
              type: "error",
              text1: "No token found",
              text2: "Please log in again",
            });
            return false;
          }

          // Decode token and check expiration
          const decoded: any = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            Toast.show({
              type: "error",
              text1: "Session expired",
              text2: "Please log in again",
            });
            set({ isTokenExpired: true });
            return false;
          }
          return true;
        } catch (error: any) {
          console.log("🚀 ~ login: ~ error:", error.response?.data?.message);
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: error.response?.data?.message,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ authUser: state.authUser }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
