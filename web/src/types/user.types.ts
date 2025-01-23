interface IUserPayload {
  userId: string;
}

enum UserRole {
  USER = "USER",
  ORGANIZER = "ORGANIZER",
  ADMIN = "ADMIN",
}

interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  authProviders?: IOAuthProvider[];
  hackathons?: IHackathon[];
  hackathonParticipations?: IHackathon[];
  profile?: IProfile;
}

interface IProfile {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
}

interface IOAuthProvider {
  id: string;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken?: string;
  userId: string;
}

interface IHackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  organizerId: string;
  participants?: IUser[];
  createdAt: string;
}
