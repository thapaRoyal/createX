import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: IUser | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem("accessToken") || null
  );
  const router = useRouter();

  // Automatically refresh token on page reload
  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!accessToken) {
        try {
          const newToken = await AuthService.refreshToken(); // Calls API to refresh token
          sessionStorage.setItem("accessToken", newToken);
          setAccessToken(newToken);
        } catch (error) {
          logout(); // If refresh fails, log out user
        }
      }
    };

    refreshAccessToken();
  }, []);

  const login = (token: string) => {
    sessionStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
    AuthService.logout(); // Call API to clear refresh token
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
