import api from "@/lib/api";

export class UserService {
  static async getUserDetails(payload: IUserPayload): Promise<IUser> {
    try {
      const response = await api.get(`/user/${payload.userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user details", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  }
}
