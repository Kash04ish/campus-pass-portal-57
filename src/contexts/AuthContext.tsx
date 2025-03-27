
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "admin" | "student" | null;

interface User {
  id: string;
  name: string;
  rollNumber: string;
  roomNumber: string;
  hostelName: string;
  contactNumber: string;
  photoUrl: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (user: User) => void;
  logout: () => void;
  registerUser: (userData: Omit<User, "id" | "role">) => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on initial mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const registerUser = (userData: Omit<User, "id" | "role">) => {
    // Generate a random ID for demo purposes
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      role: "student", // Default role for registration
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
        login,
        logout,
        registerUser,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
