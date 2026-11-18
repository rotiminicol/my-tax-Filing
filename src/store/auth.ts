import { create } from "zustand";
import { canAccess, getLimit, type FeatureKey } from "@/lib/featureAccess";
import { backendApi, clearBackendSession, getAccessToken, mapBackendUser, saveBackendSession, type BackendSession } from "@/lib/backendApi";

export type PlanTier = "free" | "deluxe" | "premium";
export type AccountType = "individual" | "organization";
export type PlanBillingCycle = "monthly" | "annual";
export type OnboardingStep = "account" | "plan" | "filing";

export interface AuthUser {
  id: string; fullName: string; email: string; phone?: string; tin?: string; nin?: string; organization?: string;
  emailVerified: boolean; onboarded: boolean; onboardingStep?: OnboardingStep | string | null;
  stateOfResidence?: string; employmentStatus?: string; role: "user" | "admin"; createdAt: string;
  plan: PlanTier | null; accountType: AccountType | null; planBillingCycle?: PlanBillingCycle | null;
  planStartDate: string; planExpiresAt: string | null; addOns: string[];
}

export function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return raw.replace(/[\s()-]/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0") && digits.length >= 11) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

interface AuthState {
  user: AuthUser | null; session: BackendSession | null; loading: boolean; pendingVerificationEmail: string | null;
  checkAvailability: (email: string, phone: string) => Promise<{ emailTaken: boolean; phoneTaken: boolean }>;
  signUp: (data: { fullName: string; email: string; phone: string; password: string; plan?: PlanTier; accountType?: AccountType; addOns?: string[] }) => Promise<AuthUser>;
  logIn: (identifier: string, password: string) => Promise<AuthUser>; logOut: () => Promise<void>;
  verifyEmail: (token: string, emailOverride?: string) => Promise<boolean>; resendVerification: (emailOverride?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>; verifyPasswordResetOtp: (email: string, token: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string, email?: string) => Promise<boolean>; changePassword: (newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<void>; updateProfile: (patch: Partial<AuthUser>) => Promise<void>;
  saveOnboardingProgress: (data: { step?: OnboardingStep; accountType?: AccountType; plan?: PlanTier; billingCycle?: PlanBillingCycle; tin?: string; organization?: string; nin?: string; stateOfResidence?: string; employmentStatus?: string; onboarded?: boolean }) => Promise<void>;
  completeOnboarding: () => Promise<void>; setRole: (role: "user" | "admin") => void;
  updatePlan: (plan: PlanTier, opts?: { accountType?: AccountType; billingCycle?: PlanBillingCycle }) => void;
  refreshUser: () => Promise<void>; checkFeatureAccess: (feature: FeatureKey) => boolean; getFeatureLimit: (feature: FeatureKey) => number | null;
}

function pendingUser(data: { fullName: string; email: string; phone: string; plan?: PlanTier; accountType?: AccountType; addOns?: string[] }): AuthUser {
  return { id: "pending", fullName: data.fullName, email: data.email, phone: data.phone, emailVerified: false, onboarded: false,
    onboardingStep: data.accountType ? "plan" : "account", role: "user", createdAt: new Date().toISOString(), plan: data.plan ?? "free",
    accountType: data.accountType ?? null, planBillingCycle: null, planStartDate: new Date().toISOString(), planExpiresAt: null, addOns: data.addOns ?? [] };
}

function pendingEmail(state: AuthState, override?: string) {
  return override?.trim().toLowerCase() || state.pendingVerificationEmail || state.user?.email || (typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-pending-verify-email") : null) || "";
}

export const useAuth = create<AuthState>()((set, get) => ({
  user: null, session: null, loading: true, pendingVerificationEmail: null,
  checkAvailability: async () => ({ emailTaken: false, phoneTaken: false }),

  signUp: async ({ fullName, email, phone, password, plan, accountType, addOns }) => {
    const cleanEmail = email.trim().toLowerCase(); const cleanPhone = normalizePhoneNumber(phone.trim()); const cleanName = fullName.trim();
    await backendApi.signup({ full_name: cleanName, email: cleanEmail, phone: cleanPhone, password, plan: plan ?? "free", account_type: accountType, add_ons: addOns ?? [] });
    if (typeof window !== "undefined") { sessionStorage.setItem("mytaxfiling-pending-verify-email", cleanEmail); sessionStorage.setItem("mytaxfiling-pending-phone", cleanPhone); sessionStorage.setItem("mytaxfiling-pending-name", cleanName); }
    const user = pendingUser({ fullName: cleanName, email: cleanEmail, phone: cleanPhone, plan, accountType, addOns });
    set({ pendingVerificationEmail: cleanEmail, user }); return user;
  },

  logIn: async (identifier, password) => {
    const data = await backendApi.login(identifier.trim(), password); saveBackendSession(data); const user = mapBackendUser(data.user);
    set({ user, session: { access_token: data.access_token, refresh_token: data.refresh_token, token_type: "bearer" }, pendingVerificationEmail: user.emailVerified ? null : user.email }); return user;
  },

  logOut: async () => { try { if (getAccessToken()) await backendApi.logout(); } catch { /* local logout */ } clearBackendSession(); set({ user: null, session: null, pendingVerificationEmail: null }); },

  verifyEmail: async (token, emailOverride) => {
    const email = pendingEmail(get(), emailOverride); if (!email) throw new Error("No pending email to verify.");
    const data = await backendApi.verifySignup(email, token.trim()); saveBackendSession(data); const user = mapBackendUser(data.user);
    set({ user, session: { access_token: data.access_token, refresh_token: data.refresh_token, token_type: "bearer" }, pendingVerificationEmail: null });
    if (typeof window !== "undefined") { sessionStorage.removeItem("mytaxfiling-pending-verify-email"); sessionStorage.removeItem("mytaxfiling-pending-phone"); sessionStorage.removeItem("mytaxfiling-pending-name"); }
    return true;
  },

  resendVerification: async (emailOverride) => { const email = pendingEmail(get(), emailOverride); if (!email) throw new Error("No pending email to verify."); await backendApi.resendSignup(email); },
  requestPasswordReset: async (email) => { const clean = email.trim().toLowerCase(); await backendApi.forgotPassword(clean); if (typeof window !== "undefined") sessionStorage.setItem("mytaxfiling-reset-email", clean); return null; },
  verifyPasswordResetOtp: async () => true,
  resetPassword: async (token, newPassword, email) => { const clean = (email || (typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-reset-email") : null) || "").trim().toLowerCase(); if (!clean) throw new Error("Please enter your email address."); await backendApi.resetPassword(clean, token.trim(), newPassword); if (typeof window !== "undefined") sessionStorage.removeItem("mytaxfiling-reset-email"); return true; },
  changePassword: async () => { throw new Error("Please use the password reset flow to change your password."); },
  deleteAccount: async () => { await backendApi.deleteAccount(); await get().logOut(); },

  updateProfile: async (patch) => {
    const data: Record<string, unknown> = {}; const map: Record<string, string> = { fullName: "full_name", email: "email", phone: "phone", tin: "tin", nin: "nin", organization: "organization", accountType: "account_type", stateOfResidence: "state_of_residence", employmentStatus: "employment_status" };
    for (const [key, value] of Object.entries(patch)) if (map[key]) data[map[key]] = value;
    set({ user: mapBackendUser(await backendApi.updateProfile(data)) });
  },

  saveOnboardingProgress: async (data) => {
    const map: Record<string, string> = { accountType: "account_type", billingCycle: "billing_cycle", stateOfResidence: "state_of_residence", employmentStatus: "employment_status" };
    const payload: Record<string, unknown> = {}; for (const [key, value] of Object.entries(data)) if (value !== undefined) payload[map[key] || key] = value;
    set({ user: mapBackendUser(await backendApi.updateOnboarding(payload)) });
  },
  completeOnboarding: async () => { set({ user: mapBackendUser(await backendApi.updateOnboarding({ step: "filing", onboarded: true })) }); },
  setRole: (role) => { const user = get().user; if (user) set({ user: { ...user, role } }); },

  updatePlan: (plan, opts) => {
    const user = get().user; if (!user) return; const billingCycle = opts?.billingCycle ?? user.planBillingCycle ?? "monthly"; const now = new Date();
    const expires = plan === "free" ? null : new Date(now.getTime() + (billingCycle === "annual" ? 365 : 30) * 86400000).toISOString();
    set({ user: { ...user, plan, planBillingCycle: plan === "free" ? null : billingCycle, planStartDate: now.toISOString(), planExpiresAt: expires, accountType: opts?.accountType ?? user.accountType } });
    void backendApi.updateSubscription({ plan, billing_cycle: plan === "free" ? undefined : billingCycle });
  },

  refreshUser: async () => {
    if (!getAccessToken()) { set({ loading: false, user: null, session: null }); return; }
    try { const backendUser = await backendApi.me(); const user = mapBackendUser(backendUser); const token = getAccessToken()!; set({ user, session: { access_token: token, refresh_token: typeof window !== "undefined" ? localStorage.getItem("mytaxfiling-refresh-token") || "" : "", token_type: "bearer" }, loading: false }); }
    catch { clearBackendSession(); set({ loading: false, user: null, session: null }); }
  },
  checkFeatureAccess: (feature) => canAccess(feature, get().user?.plan), getFeatureLimit: (feature) => getLimit(feature, get().user?.plan),
}));

if (typeof window !== "undefined") void useAuth.getState().refreshUser();
export function useRequireAuth() { if (typeof window === "undefined") return null; const user = useAuth.getState().user; if (!user) { const here = window.location.pathname + window.location.search; window.location.href = `/customer-dashboard/login?redirect=${encodeURIComponent(here)}`; return null; } return user; }
