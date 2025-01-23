import { UserRole } from "@prisma/client";

export interface IUserPayload {
  userId: string;
}

export interface IUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  isActive: boolean;
  profilePicture?: string | null;
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
