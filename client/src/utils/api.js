import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          // Clear any stored auth data
          localStorage.removeItem("authToken");
          // Redirect to login page
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
