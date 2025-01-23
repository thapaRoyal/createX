"use client";

import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the context interface
interface AuthContextType {
  accessToken: string | null;
  updateAccessToken: (token: string | null) => void;
}

// Define the provider's props
interface AuthProviderProps {
  children: ReactNode;
}

// Initialize the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get access token from cookies when the app loads
    const token = Cookies.get("access_token");
    setAccessToken(token || null);
  }, []);

  const updateAccessToken = (token: string | null) => {
    setAccessToken(token);
    if (token) {
      Cookies.set("access_token", token, { expires: 7 }); // Persist token in cookies
    } else {
      Cookies.remove("access_token"); // Remove token if logging out
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, updateAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
