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
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const fullUrl = new URL(originalRequest.url, originalRequest.baseURL).href;

    // Check if the request is to the authentication endpoints
    const isAuthEndpoint =
      fullUrl.includes("/auth/login") ||
      fullUrl.includes("/auth/refresh-token");

    // For login requests, propagate the error without any retries
    if (isAuthEndpoint && fullUrl.includes("/auth/login")) {
      return Promise.reject(error); // Let login handle its own errors
    }

    // Handle token expiration (401 Unauthorized) for other endpoints
    if (
      error.response?.status === 401 && // Unauthorized error
      !isAuthEndpoint && // Exclude authentication endpoints
      !originalRequest._retry // Prevent retrying the same request
    ) {
      console.log("401 error detected, attempting token refresh...");

      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        // Check if the user is already being redirected to login
        if (window.location.pathname !== "/auth/login") {
          // Attempt to refresh the access token using the refresh token
          const { data } = await api.post(
            "/auth/refresh-token",
            {},
            { withCredentials: true }
          );
          console.log(
            "Refresh token successful, new token received:",
            data.accessToken
          );

          accessToken = data.accessToken; // Update access token in memory

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          console.log("Already on login page, not retrying request.");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Redirect to login if the refresh token fails
        if (window.location.pathname !== "/auth/login") {
          console.log("Redirecting to login due to token refresh failure.");
          window.location.href = "/auth/login"; // Redirect to login on refresh failure
        }
        return Promise.reject(refreshError); // Reject the refresh error
      }
    }

    // Reject all other errors
    return Promise.reject(error);
  }
);

export default api;
// just try once when not logged in or token expired attempt for refresh token and try once and if not working then redirect to login page
