import axios from "axios";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

const baseURL = Platform.OS === "android" ? "http://10.0.2.2:8000/" : "http://localhost:8000/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
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
    console.log("axios error.response:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
