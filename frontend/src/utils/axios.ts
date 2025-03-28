import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "./constant";

const isDevelopment = __DEV__;
console.log("Running in", isDevelopment ? "development" : "production", "mode");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  // timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log(
    //   `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`
    // );
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log("axios response.data", response.data);
    // return response && response.data ? response.data : response;
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      Toast.show({
        type: "error",
        text1: "Token expired",
        text2: "Please log in again",
      });
    }
    console.log("axios error", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
