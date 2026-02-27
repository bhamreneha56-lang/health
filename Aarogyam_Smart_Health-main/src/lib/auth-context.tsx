"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "patient" | "doctor" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  patientId?: string;
  doctorId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

const DEMO_USERS: Record<string, User & { password: string }> = {
  "patient@aarogyam.com": {
    id: "usr-001",
    name: "Arjun Sharma",
    email: "patient@aarogyam.com",
    password: "password123",
    role: "patient",
    patientId: "AAR-001",
  },
  "doctor@aarogyam.com": {
    id: "usr-002",
    name: "Dr. Kavitha Reddy",
    email: "doctor@aarogyam.com",
    password: "password123",
    role: "doctor",
    doctorId: "DOC-001",
  },
  "admin@aarogyam.com": {
    id: "usr-003",
    name: "Admin User",
    email: "admin@aarogyam.com",
    password: "password123",
    role: "admin",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aarogyam_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (found && found.password === password) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      localStorage.setItem("aarogyam_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aarogyam_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
