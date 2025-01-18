"use client";

import { createContext, ReactNode, useContext, useState } from "react";

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

  const updateAccessToken = (token: string | null) => {
    setAccessToken(token);
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
