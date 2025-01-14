interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  message: string;
  userId: any;
}

interface AuthPayload {
  email: string;
  password: string;
}
