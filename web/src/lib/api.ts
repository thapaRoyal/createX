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
      console.log("Adding access token to request header:", accessToken);
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
    if (!originalRequest) return Promise.reject(error);

    const fullUrl = new URL(originalRequest.url, originalRequest.baseURL).href;

    console.log("Request failed:", error.response?.status, fullUrl);

    // Check if request is to authentication endpoints
    const isAuthEndpoint =
      fullUrl.includes("/auth/login") ||
      fullUrl.includes("/auth/refresh-token");

    // If login request fails, propagate the error
    if (isAuthEndpoint && fullUrl.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !originalRequest._retry // Prevent retry loops
    ) {
      console.log("401 error detected, attempting token refresh...");

      originalRequest._retry = true; // Mark request as retried

      // Check if already on login page
      if (window.location.pathname === "/auth/login") {
        console.log("Already on login page, not retrying request.");
        return Promise.reject(error);
      }

      // If no access token, redirect immediately
      if (!accessToken) {
        console.log("No access token, redirecting to login.");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const { data } = await api.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        console.log("Token refreshed successfully:", data.accessToken);

        accessToken = data.accessToken; // Update token

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        console.log("Redirecting to login due to refresh failure.");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
