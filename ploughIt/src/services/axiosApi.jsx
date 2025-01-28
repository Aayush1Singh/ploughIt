import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000", // Replace with your backend URL
  withCredentials: true, // Include cookies with requests if necessary
});

// Request Interceptor for attaching token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt"); // Or use a state management solution

  console.log("hello");
  config.headers.token = token;
  // if (token && !config._retry) {
  //   config.headers.token = token;
  //   config._retry = true;
  // }

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
    console.log("hello");
    const originalRequest = error.config;
    console.log(error);
    console.log(
      error.response,
      error.response.status,
      error.response.data?.message,
      originalRequest._retry
    );
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message === "Expired" &&
      !originalRequest._retry
    ) {
      // error.config._retry = true;

      console.log("expired received");
      try {
        console.log("hello");
        const response = await axios
          .get("http://localhost:3000/refresh", {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response.data);

            if (response.data.accessToken) {
              localStorage.setItem("jwt", response.data.accessToken);
              console.log("resending req");
              return api(originalRequest);
            }
          });
        return response;
        //generate new token
      } catch (err) {
        console.log(err);
      }
    }
    return error;
  }
);
export default api;
