import type { AuthUser } from "@/store/auth";

export type BackendSession = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
};

export type BackendAuthResponse = {
  user: BackendUser;
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
};

export type BackendUser = {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  email_verified: boolean;
  onboarded: boolean;
  onboarding_step?: string | null;
  state_of_residence?: string | null;
  employment_status?: string | null;
  tin?: string | null;
  nin?: string | null;
  organization?: string | null;
  account_type?: string | null;
  role: "user" | "admin";
  created_at: string;
  plan: "free" | "deluxe" | "premium";
  plan_billing_cycle?: "monthly" | "annual" | null;
  plan_start_date?: string | null;
  plan_expires_at?: string | null;
  add_ons: string[];
};

const API_BASE = (import.meta.env.VITE_BACKEND_API_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:8000";
const ACCESS_KEY = "mytaxfiling-access-token";
const REFRESH_KEY = "mytaxfiling-refresh-token";

export function getAccessToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY);
}

export function clearBackendSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}

export function saveBackendSession(data: BackendAuthResponse) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_KEY, data.access_token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}/api/v1${path}`, { ...init, headers });
  const text = await response.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) {
    const detail = typeof body === "object" && body !== null && "detail" in body ? (body as { detail: unknown }).detail : body;
    if (typeof detail === "object" && detail !== null && "message" in detail) {
      const error = new Error(String((detail as { message: unknown }).message));
      Object.assign(error, detail);
      throw error;
    }
    throw new Error(typeof detail === "string" ? detail : `Request failed (${response.status})`);
  }
  return body as T;
}

export const backendApi = {
  signup: (payload: { full_name: string; email: string; phone: string; password: string; plan?: string; account_type?: string; add_ons?: string[] }) =>
    request<{ message: string; cooldown_seconds: number }>("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  verifySignup: (email: string, code: string) =>
    request<BackendAuthResponse>("/auth/signup/verify", { method: "POST", body: JSON.stringify({ email, code }) }),
  resendSignup: (email: string) =>
    request<{ message: string; cooldown_seconds: number }>("/auth/signup/resend", { method: "POST", body: JSON.stringify({ email }) }),
  login: (identifier: string, password: string) =>
    request<BackendAuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password }) }),
  me: () => request<BackendUser>("/auth/me"),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) => request<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resendPasswordReset: (email: string) => request<{ message: string; cooldown_seconds: number }>("/auth/forgot-password/resend", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (email: string, code: string, new_password: string) => request<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, code, new_password }) }),
  changePassword: (current_password: string, new_password: string) => request<{ message: string }>("/auth/change-password", { method: "POST", body: JSON.stringify({ current_password, new_password }) }),
  updateProfile: (payload: Record<string, unknown>) => request<BackendUser>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) }),
  updateOnboarding: (payload: Record<string, unknown>) => request<BackendUser>("/auth/me/onboarding", { method: "PATCH", body: JSON.stringify(payload) }),
  updateSubscription: (payload: { plan: string; billing_cycle?: string }) => request<BackendUser>("/auth/me/subscription", { method: "PATCH", body: JSON.stringify(payload) }),
  deleteAccount: () => request<{ message: string }>("/auth/me", { method: "DELETE" }),
};

export function mapBackendUser(user: BackendUser): AuthUser {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone || undefined,
    tin: user.tin || undefined,
    nin: user.nin || undefined,
    organization: user.organization || undefined,
    emailVerified: user.email_verified,
    onboarded: user.onboarded,
    onboardingStep: user.onboarding_step,
    stateOfResidence: user.state_of_residence || undefined,
    employmentStatus: user.employment_status || undefined,
    role: user.role,
    createdAt: user.created_at,
    plan: user.plan,
    accountType: (user.account_type as AuthUser["accountType"]) || null,
    planBillingCycle: user.plan_billing_cycle || null,
    planStartDate: user.plan_start_date || user.created_at,
    planExpiresAt: user.plan_expires_at || null,
    addOns: user.add_ons || [],
  };
}
