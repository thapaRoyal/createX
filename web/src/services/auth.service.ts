import api from "@/lib/api";

export class AuthService {
  static async login(payload: AuthPayload): Promise<LoginResponse> {
    try {
      const response = await api.post("auth/login", payload);
      const { accessToken, user } = response.data;

      return { accessToken, user };
    } catch (error: any) {
      throw new Error(error.response.data.message, error);
    }
  }

  static async register(payload: AuthPayload): Promise<RegisterResponse> {
    try {
      const response = await api.post("auth/register", payload);
      const { message, userId, accessToken } = response.data;
      return { message, userId, accessToken };
    } catch (error: any) {
      throw new Error(error.response.data.message, error);
    }
  }

  static async logout(): Promise<void> {
    try {
      const res = await api.post("auth/logout");
      return res.data;
    } catch (error) {
      console.error("Logout failed", error);
      throw new Error("Logout failed");
    }
  }
}
