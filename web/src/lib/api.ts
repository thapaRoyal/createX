import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
});

// Store access token in memory
let accessToken: string | null = null;

api.interceptors.request.use(
  (config) => {
    // Attach access token to headers if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop
      try {
        // Request a new access token using the refresh token
        const { data } = await axios.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        accessToken = data.accessToken; // Update access token in memory

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login"; // Redirect to login on failure
      }
    }

    return Promise.reject(error);
  }
);

export default api;
