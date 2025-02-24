import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
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
    console.log("axios response", response);
    // return response && response.data ? response.data : response;
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("axios error.response:", error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
