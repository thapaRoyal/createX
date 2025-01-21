export class userService {
  static async getUser(payload: IUserPayload): Promise<IUser> {
    try {
      //
    } catch (error: any) {
      throw new Error(error.response.data.message, error);
    }
  }
}
