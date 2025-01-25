"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the user context interface
interface UserContextType {
  user: IUser | null;
  updateUser: (userData: IUser | null) => void;
}

// Define the provider's props
interface UserProviderProps {
  children: ReactNode;
}

// Initialize the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Method to update user data
  const updateUser = (userData: IUser | null) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
