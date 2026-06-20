import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type PlanTier = "free" | "deluxe" | "premium";
export type AccountType = "individual" | "organization";
export type PlanBillingCycle = "monthly" | "annual";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  tin?: string;
  organization?: string;
  emailVerified: boolean;
  onboarded: boolean;
  role: "user" | "admin";
  createdAt: string;
  plan: PlanTier | null;
  accountType: AccountType | null;
  planBillingCycle?: PlanBillingCycle | null;
  planStartDate: string;
  planExpiresAt: string | null;
  addOns: string[];
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  pendingVerificationEmail: string | null;

  signUp: (data: {
    fullName: string;
    email: string;
    password: string;
    plan?: PlanTier;
    accountType?: AccountType;
    addOns?: string[];
  }) => Promise<AuthUser>;
  logIn: (email: string, password: string) => Promise<AuthUser>;
  logOut: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  updateProfile: (patch: Partial<AuthUser>) => void;
  completeOnboarding: () => void;
  setRole: (role: "user" | "admin") => void;
  updatePlan: (
    plan: PlanTier,
    opts?: { accountType?: AccountType; billingCycle?: PlanBillingCycle },
  ) => void;
  refreshUser: () => Promise<void>;
}

async function hydrateUser(sUser: SupabaseUser): Promise<AuthUser> {
  const [profileRes, subRes, rolesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", sUser.id).maybeSingle(),
    supabase.from("subscriptions").select("*").eq("user_id", sUser.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", sUser.id),
  ]);

  const profile = profileRes.data;
  const sub = subRes.data;
  const roles = (rolesRes.data ?? []).map((r) => r.role);
  const role: "user" | "admin" = roles.includes("admin" as never) ? "admin" : "user";

  const planRaw = (sub?.plan as string | undefined) ?? "free";
  const plan: PlanTier = planRaw === "deluxe" || planRaw === "premium" || planRaw === "free"
    ? (planRaw as PlanTier)
    : "free";

  return {
    id: sUser.id,
    email: sUser.email ?? profile?.email ?? "",
    fullName:
      profile?.full_name ??
      (sUser.user_metadata?.full_name as string | undefined) ??
      "",
    tin: profile?.tin ?? undefined,
    organization: profile?.organization ?? profile?.business_name ?? undefined,
    emailVerified: !!sUser.email_confirmed_at,
    onboarded: !!profile?.onboarded,
    role,
    createdAt: sUser.created_at ?? new Date().toISOString(),
    plan,
    accountType: (profile?.account_type as AccountType | null) ?? null,
    planBillingCycle: (sub?.billing_cycle as PlanBillingCycle | null) ?? null,
    planStartDate: sub?.current_period_start ?? sub?.created_at ?? new Date().toISOString(),
    planExpiresAt: sub?.current_period_end ?? null,
    addOns: (profile?.add_ons as string[] | null) ?? [],
  };
}

export const useAuth = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  loading: true,
  pendingVerificationEmail: null,

  signUp: async ({ fullName, email, password, plan, accountType, addOns }) => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/customer-dashboard/verify-email`
        : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName.trim(),
          desired_plan: plan ?? null,
          desired_account_type: accountType ?? null,
          desired_add_ons: addOns ?? [],
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Sign-up failed. Please try again.");

    set({ pendingVerificationEmail: email.trim().toLowerCase() });

    // If a session was returned (auto-confirm enabled), hydrate immediately.
    if (data.session) {
      const u = await hydrateUser(data.user);
      set({ user: u, session: data.session });
      return u;
    }

    // Return a stub user; the verify page reads pendingVerificationEmail.
    return {
      id: data.user.id,
      email: data.user.email ?? email,
      fullName: fullName.trim(),
      emailVerified: false,
      onboarded: false,
      role: "user",
      createdAt: data.user.created_at ?? new Date().toISOString(),
      plan: plan ?? null,
      accountType: accountType ?? null,
      planBillingCycle: null,
      planStartDate: new Date().toISOString(),
      planExpiresAt: null,
      addOns: addOns ?? [],
    };
  },

  logIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("No account found for this email.");

    if (!data.user.email_confirmed_at) {
      set({ pendingVerificationEmail: data.user.email ?? email });
    }

    const u = await hydrateUser(data.user);
    set({ user: u, session: data.session });
    return u;
  },

  logOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, pendingVerificationEmail: null });
  },

  verifyEmail: async (token) => {
    const email = get().pendingVerificationEmail ?? get().user?.email;
    if (!email) return false;
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: "signup",
    });
    if (error || !data.user) return false;
    const u = await hydrateUser(data.user);
    set({ user: u, session: data.session, pendingVerificationEmail: null });
    return true;
  },

  resendVerification: async () => {
    const email = get().pendingVerificationEmail ?? get().user?.email;
    if (!email) return;
    await supabase.auth.resend({ type: "signup", email });
  },

  requestPasswordReset: async (email) => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/customer-dashboard/reset-password`
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });
    if (error) {
      // Don't reveal whether the account exists.
      return null;
    }
    return null;
  },

  resetPassword: async (_token, newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return false;
    return true;
  },

  updateProfile: (patch) => {
    const u = get().user;
    if (!u) return;
    const merged = { ...u, ...patch };
    set({ user: merged });
    const dbPatch: Record<string, string | string[] | null> = {};
    if (patch.fullName !== undefined) dbPatch.full_name = patch.fullName;
    if (patch.email !== undefined) dbPatch.email = patch.email;
    if (patch.tin !== undefined) dbPatch.tin = patch.tin;
    if (patch.organization !== undefined) dbPatch.organization = patch.organization ?? null;
    if (patch.accountType !== undefined) dbPatch.account_type = patch.accountType;
    if (patch.addOns !== undefined) dbPatch.add_ons = patch.addOns;
    if (Object.keys(dbPatch).length) {
      void supabase.from("profiles").update(dbPatch as never).eq("id", u.id);
    }
  },

  completeOnboarding: () => {
    const u = get().user;
    if (!u) return;
    set({ user: { ...u, onboarded: true } });
    void supabase.from("profiles").update({ onboarded: true }).eq("id", u.id);
  },

  setRole: (role) => {
    const u = get().user;
    if (!u) return;
    set({ user: { ...u, role } });
  },

  updatePlan: (plan, opts) => {
    const u = get().user;
    if (!u) return;
    const now = new Date();
    const billingCycle = opts?.billingCycle ?? u.planBillingCycle ?? "monthly";
    const cycleMs =
      billingCycle === "annual" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const expires = plan === "free" ? null : new Date(now.getTime() + cycleMs).toISOString();

    const patch: Partial<AuthUser> = {
      plan,
      planBillingCycle: plan === "free" ? null : billingCycle,
      planStartDate: now.toISOString(),
      planExpiresAt: expires,
    };
    if (opts?.accountType) patch.accountType = opts.accountType;

    set({ user: { ...u, ...patch } });

    void supabase.from("subscriptions").upsert(
      {
        user_id: u.id,
        plan,
        status: "active",
        billing_cycle: plan === "free" ? null : billingCycle,
        current_period_start: now.toISOString(),
        current_period_end: expires,
      },
      { onConflict: "user_id" },
    );
    if (opts?.accountType) {
      void supabase.from("profiles").update({ account_type: opts.accountType }).eq("id", u.id);
    }
  },

  refreshUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      set({ user: null, session: null, loading: false });
      return;
    }
    const u = await hydrateUser(data.user);
    set({ user: u, loading: false });
  },
}));

// Initialize once on the client.
if (typeof window !== "undefined") {
  supabase.auth.getSession().then(async ({ data }) => {
    if (data.session?.user) {
      try {
        const u = await hydrateUser(data.session.user);
        useAuth.setState({ user: u, session: data.session, loading: false });
      } catch {
        useAuth.setState({ loading: false });
      }
    } else {
      useAuth.setState({ loading: false });
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session?.user) {
      useAuth.setState({ user: null, session: null, pendingVerificationEmail: null });
      return;
    }
    if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
      hydrateUser(session.user)
        .then((u) => useAuth.setState({ user: u, session }))
        .catch(() => useAuth.setState({ session }));
    }
  });
}

export function useRequireAuth() {
  if (typeof window === "undefined") return null;
  const user = useAuth.getState().user;
  if (!user) {
    const here = window.location.pathname + window.location.search;
    window.location.href = `/customer-dashboard/login?redirect=${encodeURIComponent(here)}`;
    return null;
  }
  return user;
}
