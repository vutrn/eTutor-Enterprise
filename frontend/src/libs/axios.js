import axios from "axios";
import nProgress from "nprogress";

nProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    nProgress.start();
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
    nProgress.done();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("axios response.data", response.data);
    return response ? response.data : response; // Returning only the data for easier access in components
  },
  function (error) {
    nProgress.done();
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("axios error.response:", error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
