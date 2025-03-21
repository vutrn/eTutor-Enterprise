import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

// Get API URL from environment or use default based on platform
const getBaseUrl = () => {
  // For production deployment
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  
  // For local development
  return Platform.OS === "android" 
    ? "http://10.0.2.2:8000/" 
    : "http://localhost:8000/";
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      Toast.show({
        type: "error",
        text1: "Token expired",
        text2: "Please log in again",
      });
    }
    console.log("axios error.response:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
