import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  // baseURL: "http://localhost:3000", // Replace with your backend URL
  withCredentials: true, // Include cookies with requests if necessary
});

// Request Interceptor for attaching token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  config.headers.token = token;
  return config;
});

// Response Interceptor for handling token expiration
// api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response &&
//       error.response.status === 400 &&
//       error.response.message === "Expired" &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       try {
//         const response = await axios.get("http://localhost:3000/refresh", {
//           withCredentials: true,
//         });
//         const newToken = response.data.token;
//         // Store the new token
//         localStorage.setItem("jwt", newToken);
//         // Update the original request with the new token
//         originalRequest.headers.token = `${newToken}`;
//         return api(originalRequest); // Retry the request
//       } catch (err) {
//         console.error("Token refresh failed:", err);
//         // Optionally, redirect to login page or show error
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message == "Network Error") {
      toast.error("Server is currently down");
    }
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message === "Expired" &&
      !originalRequest._retry
    ) {
      // console.log("expired received");
      try {
        // console.log("hello");
        const response = await axios
          .get("http://localhost:3000/refresh", {
            withCredentials: true,
          })
          .then((response) => {
            // console.log(response.data);
            if (response.data.accessToken) {
              localStorage.setItem("jwt", response.data.accessToken);
              return api(originalRequest);
            }
          });
        return response;
      } catch (err) {
        toast.error("User not authenticated");
        return err;
      }
    }
    return error;
  },
);
export default api;
