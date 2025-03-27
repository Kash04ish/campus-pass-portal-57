
import React, { createContext, useContext, useState, useEffect } from "react";
import { getStudentByRollNumber } from "../utils/storage";

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
  password?: string; // Added for admin authentication
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
  adminLogin: (id: string, password: string) => boolean;
  studentLogin: (rollNumber: string) => boolean; // New student login function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Admin credentials - in a real app, these would be stored in a secure database
const ADMIN_CREDENTIALS = {
  id: "admin123",
  password: "admin123",
  name: "Administrator",
  rollNumber: "ADMIN001",
  roomNumber: "Admin Office",
  hostelName: "Administration Building",
  contactNumber: "123-456-7890",
  photoUrl: "",
  role: "admin" as const,
};

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

  const adminLogin = (id: string, password: string): boolean => {
    // Check if credentials match admin credentials
    if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
      login(ADMIN_CREDENTIALS);
      return true;
    }
    return false;
  };

  const studentLogin = (rollNumber: string): boolean => {
    // Find student by roll number
    const student = getStudentByRollNumber(rollNumber);
    if (student) {
      // Create a user object with the student data
      const userData: User = {
        ...student,
        role: "student",
      };
      login(userData);
      return true;
    }
    return false;
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
        adminLogin,
        studentLogin,
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
