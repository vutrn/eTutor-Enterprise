import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "../utils/axios";

interface AuthStore {
  user: any;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  signup: (formData: any) => void;
  login: (formData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      user: null,
      isSigningUp: false,
      isLoggingIn: false,

      signup: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("v1/auth/register", formData);
          set({ user: res.data });
          console.log("Signup successful:", res.data);
        } catch (error) {
          console.error("Signup failed:", (error as any).message);
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async () => {},

      logout: () => {},
    }),
    {
      name: "user-store",
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
