interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
  };
}

interface RegisterResponse {
  message: string;
  userId: any;
  accessToken: string;
}

interface AuthPayload {
  email: string;
  password: string;
}
