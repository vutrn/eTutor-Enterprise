import { create } from "zustand";
import toast from "react-hot-toast";
import instance from "../libs/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    accessToken: null,
    refreshToken: null,

    signup: async(formData) => {
        set({ isSigningUp: true });
        try {
            const res = await instance.post("v1/auth/register", formData);
            console.log("res", res);
            set({ authUser: res.user });
            console.log("authUser", res.user);
            toast.success("Signup successful");
        } catch (error) {
            console.error("Signup failed:", error.response ? error.response.data : error.message);
            toast.error("Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async(formData) => {
        try {
            const response = await axios.post("/api/auth/login", formData);
            set({
                user: response.data.user,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    },

    updateAccessToken: (newToken) => set({ accessToken: newToken }),

    refreshAccessToken: async() => {
        try {
            const refreshToken = get().refreshToken;
            const response = await axios.post("/api/auth/refresh-token", { refreshToken });
            set({ accessToken: response.data.accessToken });
        } catch (error) {
            console.error("Failed to refresh token:", error);
        }
    },

    logout: () => set({ user: null, accessToken: null, refreshToken: null }),

    updateProfile: async(formData) => {},

    connectSocket: async() => {},

    disconnectSocket: async() => {},
}));