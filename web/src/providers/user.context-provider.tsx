"use client";

import { useGetuser } from "@/hooks/use-user";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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

  // Use the custom hook to fetch the user
  const { data: fetchedUser } = useGetuser();

  // Sync the fetched user with the context
  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser); // Update user context
    }
  }, [fetchedUser]);

  // Method to update user data manually
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
