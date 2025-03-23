import axios from "axios";
import { get } from "lodash";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

const getBaseUrl = () => {
  // For production deployment
  if (Constants.expoConfig?.extra?.apiUrl) {
    console.log("Constants.expoConfig.extra.apiUrl", Constants.expoConfig.extra.apiUrl);
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
    console.log("axios error", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
