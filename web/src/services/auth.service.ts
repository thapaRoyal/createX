import api from "@/lib/api";
import { useAuth } from "@/providers/auth.content-provider";

export class AuthService {
  static async login(payload: AuthPayload): Promise<LoginResponse> {
    try {
      const response = await api.post("auth/login", payload);
      const { accessToken, refreshToken } = response.data;

      // Get the updateAccessToken function from the context
      const { updateAccessToken } = useAuth();

      // Store tokens in context (in memory)
      updateAccessToken(accessToken); // Set the access token in context
      // Optionally store refresh token in an httpOnly cookie (already handled by backend)

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed");
    }
  }

  static async register(payload: AuthPayload): Promise<RegisterResponse> {
    try {
      const response = await api.post("auth/register", payload);
      const { message, userId } = response.data;
      return { message, userId };
    } catch (error) {
      console.error("Registration failed", error);
      throw new Error("Registration failed");
    }
  }

  static logout(): void {
    const { updateAccessToken } = useAuth();

    // Clear the access token from context
    updateAccessToken(null);

    // You can also clear the refresh token from cookies (not using localStorage)
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Clear the refresh token cookie
  }

  static getCurrentUser(): any {
    // Since we no longer store the user data in localStorage, you can manage it via context
    return null; // Or return from API if necessary
  }
}
