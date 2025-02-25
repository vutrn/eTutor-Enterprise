import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import Toast from "react-native-toast-message";

interface AuthState {
  authUser: any;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  accessToken: string | null;
  signup: (formData: any) => Promise<boolean>;
  login: (formData: any) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      accessToken: null,

      signup: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("v1/auth/register", formData);
          set({ authUser: res.data });
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
          set({ authUser: res.data });

          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
          await AsyncStorage.setItem("access-token", res.data.accessToken);

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
          // Clear localStorage
          await AsyncStorage.removeItem("authUser");
          await AsyncStorage.removeItem("accessToken");
          set({ authUser: null, accessToken: null });
          Toast.show({ type: "success", text1: "Logged out", text2: "See you soon!" });
        } catch (error: any) {
          console.log(error.response?.data?.message);
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({ authUser: state.authUser }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       authUser: null,
//       accessToken: null,
//       isSigningUp: false,
//       isLoggingIn: false,
//       isCheckingAuth: true,

//       signup: async (formData) => {
//         set({ isSigningUp: true });
//         try {
//           const res = await axiosInstance.post("v1/auth/register", formData);
//           set({ authUser: res });
//           toast.success("Signup successful");
//         } catch (error) {
//           console.error("Signup failed:", error.response.data.message);
//           toast.error(error.response.data.message);
//         } finally {
//           set({ isSigningUp: false });
//         }
//       },

//       login: async (formData) => {
//         set({ isLoggingIn: true });
//         try {
//           const res = await axiosInstance.post("/v1/auth/login", formData);
//           localStorage.setItem("accessToken", res.accessToken);
//           set({ authUser: res, accessToken: res.accessToken });
//           toast.success("Login successful");
//         } catch (error) {
//           console.error("Login error:", error.response?.data?.message);
//           toast.error(error.response?.data?.message);
//         } finally {
//           set({ isLoggingIn: false });
//         }
//       },

//       logout: async () => {
//         try {
//           await axiosInstance.post("v1/auth/logout");
//           // Clear localStorage
//           localStorage.removeItem("authUser");
//           localStorage.removeItem("accessToken");
//           set({ authUser: null, accessToken: null });
//           toast.success("Logged out successfully.");
//         } catch (error) {
//           console.log(error.response?.data?.message);
//         }
//       },

//       updateProfile: async (formData) => {},

//       connectSocket: async () => {},

//       disconnectSocket: async () => {},
//     }),
//     {
//       name: "auth-storage", // name of the item in the storage (must be unique)
//       partialize: (state) => ({ authUser: state.authUser }),
//     }
//   )
// );
