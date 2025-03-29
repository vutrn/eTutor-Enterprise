import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IAuthState } from "../types/store";
import axiosInstance from "../utils/axios";
import { API_BASE_URL } from "../utils/constant";

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      authUser: {
        _id: "",
        username: "",
        email: "",
        role: "",
        accessToken: "",
        refreshToken: "",
      },
      isSigningUp: false,
      isLoggingIn: false,
      accessToken: null,
      refreshToken: null,
      isTokenExpired: false,
      onlineUsers: [],
      socket: null,

      signup: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("v1/auth/register", formData);

          console.log("Signup successful:", res.data);
          Toast.show({
            type: "success",
            text1: "Signup successful",
            text2: "Welcome!",
          });
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
          get().connectSocket();

          return true;
        } catch (error: any) {
          console.log("🚀 ~ login: ~ error:", error.response?.data?.message);
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: error?.message,
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
          get().disconnectSocket();
        } catch (error: any) {
          console.log(error.message);
        }
      },

      verifyToken: async () => {
        try {
          const token = await AsyncStorage.getItem("access-token");
          if (!token) return false;

          const decoded: any = jwtDecode(token);
          // console.log("expire in", decoded.exp * 1000, Date.now());
          if (decoded.exp * 1000 < Date.now()) {
            set({ isTokenExpired: true });
            return false;
          }
          return true;
        } catch (error: any) {
          console.log("Error verifying token:", error?.message);
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: error.response?.data?.message,
          });
          return false;
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(API_BASE_URL, {
          query: { userId: authUser._id },
        });

        socket.connect();
        set({ socket });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        // Listen for online users updates only
        socket.on("getOnlineUsers", (onlineUserIds: string[]) => {
          set({ onlineUsers: onlineUserIds });
          console.log("Online users updated:", onlineUserIds);
        });

        // Message handling will be in useMessageStore
      },

      disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null });
          console.log("Socket disconnected:", socket.id);
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
