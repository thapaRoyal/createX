import api from "@/lib/api";

export class UserService {
  static async getUserDetails(): Promise<IUser> {
    try {
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user details", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  }
}
