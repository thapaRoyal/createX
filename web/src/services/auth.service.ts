import api from "@/lib/api";

export class AuthService {
  // Login
  static async login(payload: AuthPayload): Promise<LoginResponse> {
    try {
      const response = await api.post("auth/login", payload);
      const { accessToken, refreshToken } = response.data;
      AuthService.saveToLocalStorage({ accessToken, refreshToken });
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed");
    }
  }

  // Register
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

  // Logout
  static logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // Get Current User (if needed)
  static getCurrentUser(): any {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    return JSON.parse(localStorage.getItem("user") || "{}"); // Simple user object retrieval from storage
  }

  static saveToLocalStorage(value: LoginResponse) {
    localStorage.setItem("accessToken", value.accessToken);
    localStorage.setItem("refreshToken", value.refreshToken);
  }
}
