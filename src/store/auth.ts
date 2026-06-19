import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface StoredAccount extends AuthUser {
  passwordHash: string; // simple base64   frontend mock only
}

interface AuthState {
  user: AuthUser | null;
  accounts: StoredAccount[];
  resetTokens: Record<string, string>; // email -> token
  adminLoggedInInMemory: boolean; // transient memory-only token
  signUp: (data: { fullName: string; email: string; password: string; plan?: PlanTier; accountType?: AccountType; addOns?: string[] }) => Promise<AuthUser>;
  logIn: (email: string, password: string) => Promise<AuthUser>;
  logOut: () => void;
  verifyEmail: (token: string) => boolean;
  requestPasswordReset: (email: string) => string | null;
  resetPassword: (token: string, newPassword: string) => boolean;
  updateProfile: (patch: Partial<AuthUser>) => void;
  completeOnboarding: () => void;
  setRole: (role: "user" | "admin") => void;
  updatePlan: (
    plan: PlanTier,
    opts?: { accountType?: AccountType; billingCycle?: PlanBillingCycle },
  ) => void;
}

const hash = (s: string) => {
  if (typeof window === "undefined") return s;
  return btoa(unescape(encodeURIComponent(s + "::aurum")));
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [
        {
          id: "admin-default",
          fullName: "System Administrator",
          email: "admin@myrentreceipt.com",
          emailVerified: true,
          onboarded: true,
          role: "admin",
          createdAt: new Date().toISOString(),
          passwordHash: "YWRtaW4xMjM6OmF1cnVt", // hash for "admin123"
          plan: "premium",
          accountType: "organization",
          planBillingCycle: "annual",
          planStartDate: new Date().toISOString(),
          planExpiresAt: null,
          addOns: [],
        },
        {
          id: "user-default",
          fullName: "Oluwadurotimi Tenant",
          email: "user@myrentreceipt.com",
          emailVerified: true,
          onboarded: true,
          role: "user",
          createdAt: new Date().toISOString(),
          passwordHash: "dXNlcjEyMzo6YXVydW0=", // hash for "user123"
          plan: "deluxe",
          accountType: "individual",
          planBillingCycle: "monthly",
          planStartDate: new Date().toISOString(),
          planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          addOns: [],
        }
      ],
      resetTokens: {},
      adminLoggedInInMemory: false,

      signUp: async ({ fullName, email, password, plan, accountType, addOns }) => {
        const existing = get().accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
        if (existing) throw new Error("An account with this email already exists.");
        const selectedPlan = plan || null;
        const selectedAccountType = accountType || null;
        const now = new Date();
        const acct: StoredAccount = {
          id: crypto.randomUUID(),
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          emailVerified: false,
          onboarded: false,
          role: "user",
          createdAt: now.toISOString(),
          passwordHash: hash(password),
          plan: selectedPlan,
          accountType: selectedAccountType,
          planBillingCycle: null,
          planStartDate: now.toISOString(),
          planExpiresAt: !selectedPlan || selectedPlan === "free" ? null : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          addOns: addOns || [],
        };
        set({ accounts: [...get().accounts, acct], user: stripPwd(acct), adminLoggedInInMemory: false });
        return stripPwd(acct);
      },

      logIn: async (email, password) => {
        // Hydrate default accounts if missing in localStorage
        const currentAccounts = get().accounts;
        const hasAdmin = currentAccounts.some(a => a.email.toLowerCase() === "admin@myrentreceipt.com");
        const hasUser = currentAccounts.some(a => a.email.toLowerCase() === "user@myrentreceipt.com");
        
        let updatedAccounts = [...currentAccounts];
        if (!hasAdmin) {
          updatedAccounts.push({
            id: "admin-default",
            fullName: "System Administrator",
            email: "admin@myrentreceipt.com",
            emailVerified: true,
            onboarded: true,
            role: "admin",
            createdAt: new Date().toISOString(),
            passwordHash: hash("admin123"),
            plan: "premium",
            accountType: "organization",
            planBillingCycle: "annual",
            planStartDate: new Date().toISOString(),
            planExpiresAt: null,
            addOns: [],
          });
        }
        if (!hasUser) {
          updatedAccounts.push({
            id: "user-default",
            fullName: "Oluwadurotimi Tenant",
            email: "user@myrentreceipt.com",
            emailVerified: true,
            onboarded: true,
            role: "user",
            createdAt: new Date().toISOString(),
            passwordHash: hash("user123"),
            plan: "deluxe",
            accountType: "individual",
            planBillingCycle: "monthly",
            planStartDate: new Date().toISOString(),
            planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            addOns: [],
          });
        }
        
        if (!hasAdmin || !hasUser) {
          set({ accounts: updatedAccounts });
        }

        const acct = updatedAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
        if (!acct) throw new Error("No account found for this email.");
        if (acct.passwordHash !== hash(password)) throw new Error("Incorrect password.");
        
        // Force systemic name updates for the default accounts to prevent browser cache mismatch
        if (acct.email.toLowerCase() === "admin@myrentreceipt.com") {
          acct.fullName = "System Administrator";
          acct.role = "admin";
        } else {
          // Self-heal: customer accounts must always have role "user".
          // Repairs any account corrupted by the old dev "Promote to Admin" toggle.
          if (acct.role !== "user") {
            acct.role = "user";
            set({
              accounts: get().accounts.map((a) =>
                a.id === acct.id ? { ...a, role: "user" } : a,
              ),
            });
          }
        }
        
        const u = stripPwd(acct);
        set({ user: u, adminLoggedInInMemory: u.role === "admin" });
        return u;
      },

      logOut: () => set({ user: null, adminLoggedInInMemory: false }),

      verifyEmail: (token) => {
        const u = get().user;
        if (!u) return false;
        // Token = first 6 chars of user id, mock
        if (token !== u.id.slice(0, 6)) return false;
        const updated = { ...u, emailVerified: true };
        set({
          user: updated,
          accounts: get().accounts.map((a) => (a.id === u.id ? { ...a, emailVerified: true } : a)),
        });
        return true;
      },

      requestPasswordReset: (email) => {
        const acct = get().accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
        if (!acct) return null;
        const token = crypto.randomUUID().slice(0, 8);
        set({ resetTokens: { ...get().resetTokens, [acct.email]: token } });
        return token;
      },

      resetPassword: (token, newPassword) => {
        const entry = Object.entries(get().resetTokens).find(([, t]) => t === token);
        if (!entry) return false;
        const [email] = entry;
        set({
          accounts: get().accounts.map((a) =>
            a.email === email ? { ...a, passwordHash: hash(newPassword) } : a,
          ),
          resetTokens: Object.fromEntries(Object.entries(get().resetTokens).filter(([e]) => e !== email)),
        });
        return true;
      },

      updateProfile: (patch) => {
        const u = get().user;
        if (!u) return;
        const merged = { ...u, ...patch };
        set({
          user: merged,
          accounts: get().accounts.map((a) => (a.id === u.id ? { ...a, ...patch } : a)),
        });
      },

      completeOnboarding: () => {
        const u = get().user;
        if (!u) return;
        const merged = { ...u, onboarded: true };
        set({
          user: merged,
          accounts: get().accounts.map((a) => (a.id === u.id ? { ...a, onboarded: true } : a)),
        });
      },

      setRole: (role) => {
        const u = get().user;
        if (!u) return;
        const merged = { ...u, role };
        set({
          user: merged,
          accounts: get().accounts.map((a) => (a.id === u.id ? { ...a, role } : a)),
        });
      },

      updatePlan: (plan, opts) => {
        const u = get().user;
        if (!u) return;
        const now = new Date();
        const billingCycle = opts?.billingCycle ?? u.planBillingCycle ?? "monthly";
        const cycleMs =
          billingCycle === "annual" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const patch: Partial<AuthUser> = {
          plan,
          planBillingCycle: plan === "free" ? null : billingCycle,
          planStartDate: now.toISOString(),
          planExpiresAt: plan === "free" ? null : new Date(now.getTime() + cycleMs).toISOString(),
        };
        if (opts?.accountType) patch.accountType = opts.accountType;
        const merged = { ...u, ...patch };
        set({
          user: merged,
          accounts: get().accounts.map((a) => (a.id === u.id ? { ...a, ...patch } : a)),
        });
      },
    }),
    {
      name: "rr-auth-v1",
      partialize: (state) => {
        // Strict Security Boundary: Admin sessions and memory tokens are never written to localStorage
        if (state.user?.role === "admin") {
          return {
            ...state,
            user: null,
            adminLoggedInInMemory: false,
          };
        }
        return {
          ...state,
          adminLoggedInInMemory: false, // Do not persist the transient memory token
        };
      },
    },
  ),
);

function stripPwd(a: StoredAccount): AuthUser {
  const { passwordHash: _p, ...rest } = a;
  return rest;
}

export function useRequireAuth() {
  if (typeof window === "undefined") return null;
  const user = useAuth.getState().user;
  if (!user) {
    const here = window.location.pathname + window.location.search;
    window.location.href = `/login?redirect=${encodeURIComponent(here)}`;
    return null;
  }
  return user;
}