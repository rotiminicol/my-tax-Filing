import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

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
  loading: boolean;
  logInAdmin: (email: string, password: string) => Promise<AdminUser>;
  logOutAdmin: () => Promise<void>;
  hydrateAdmin: () => Promise<void>;
}

async function loadAdminFromSession(userId: string, email: string): Promise<AdminUser | null> {
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, created_at")
    .eq("id", userId)
    .maybeSingle();
  return {
    id: userId,
    email,
    fullName: profile?.full_name ?? "Administrator",
    role: "admin",
    createdAt: profile?.created_at ?? new Date().toISOString(),
  };
}

export const useAdminAuth = create<AdminAuthState>()((set) => ({
  adminUser: null,
  adminLoggedInInMemory: false,
  loading: true,

  logInAdmin: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Authentication failed.");

    const admin = await loadAdminFromSession(data.user.id, data.user.email ?? email);
    if (!admin) {
      await supabase.auth.signOut();
      throw new Error("This account does not have administrator access.");
    }
    set({ adminUser: admin, adminLoggedInInMemory: true, loading: false });
    return admin;
  },

  logOutAdmin: async () => {
    await supabase.auth.signOut();
    set({ adminUser: null, adminLoggedInInMemory: false, loading: false });
  },

  hydrateAdmin: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      set({ adminUser: null, adminLoggedInInMemory: false, loading: false });
      return;
    }
    const u = data.session.user;
    const admin = await loadAdminFromSession(u.id, u.email ?? "");
    set({
      adminUser: admin,
      adminLoggedInInMemory: !!admin,
      loading: false,
    });
  },
}));

if (typeof window !== "undefined") {
  void useAdminAuth.getState().hydrateAdmin();
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session?.user) {
      useAdminAuth.setState({ adminUser: null, adminLoggedInInMemory: false, loading: false });
      return;
    }
    if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
      void useAdminAuth.getState().hydrateAdmin();
    }
  });
}
