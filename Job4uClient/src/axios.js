import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  // Uncomment if you need credentials, e.g., cookies
  // withCredentials: true
});

instance.interceptors.response.use(
  (response) => {
    // Handle successful response
    const { data } = response;
    return data;
  },
  (error) => {
    // Handle errors gracefully
    if (error.response) {
      // Server responded with a status code out of 2xx range
      console.error("Error Response:", error.response);
      return Promise.reject({
        message: error.response.data?.message || "Server Error",
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // No response was received
      console.error("No Response Received:", error.request);
      return Promise.reject(new Error("No response received from server"));
    } else {
      // Error in setting up the request
      console.error("Request Setup Error:", error.message);
      return Promise.reject(new Error(error.message || "Unexpected Error"));
    }
  }
);

export default instance;
