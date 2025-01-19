import api from "@/lib/api";

export class AuthService {
  static async login(payload: AuthPayload): Promise<LoginResponse> {
    try {
      const response = await api.post("auth/login", payload);
      const { accessToken, refreshToken } = response.data;

      return { accessToken, refreshToken };
    } catch (error: any) {
      throw new Error(error.response.data.message, error);
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
}
