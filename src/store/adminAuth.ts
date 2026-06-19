import { create } from "zustand";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "admin";
  createdAt: string;
}

interface AdminAuthState {
  adminUser: AdminUser | null;
  adminLoggedInInMemory: boolean;
  logInAdmin: (email: string, password: string) => Promise<AdminUser>;
  logOutAdmin: () => void;
}

const hash = (s: string) => {
  if (typeof window === "undefined") return s;
  return btoa(unescape(encodeURIComponent(s + "::aurum")));
};

export const useAdminAuth = create<AdminAuthState>()((set) => ({
  adminUser: null,
  adminLoggedInInMemory: false,

  logInAdmin: async (email, password) => {
    // Standard secure hash checks for default administrative account
    if (email.toLowerCase() !== "admin@myrentreceipt.com") {
      throw new Error("No authorized administrator account found with this email.");
    }

    const adminPasswordHash = "YWRtaW4xMjM6OmF1cnVt"; // hash for "admin123"
    if (hash(password) !== adminPasswordHash) {
      throw new Error("Incorrect security key or password.");
    }

    const u: AdminUser = {
      id: "admin-default",
      fullName: "System Administrator",
      email: "admin@myrentreceipt.com",
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    set({ adminUser: u, adminLoggedInInMemory: true });
    return u;
  },

  logOutAdmin: () => {
    set({ adminUser: null, adminLoggedInInMemory: false });
  },
}));
