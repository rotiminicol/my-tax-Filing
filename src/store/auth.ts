import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { canAccess, getLimit, type FeatureKey } from "@/lib/featureAccess";
import {
  sendVerificationOtpEmail,
  sendResendVerificationOtpEmail,
  sendPasswordResetOtpEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
} from "@/lib/email/emailClient";

export type PlanTier = "free" | "deluxe" | "premium";
export type AccountType = "individual" | "organization";
export type PlanBillingCycle = "monthly" | "annual";
export type OnboardingStep = "account" | "plan" | "filing";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  tin?: string;
  nin?: string;
  organization?: string;
  emailVerified: boolean;
  onboarded: boolean;
  onboardingStep?: OnboardingStep | string | null;
  stateOfResidence?: string;
  employmentStatus?: string;
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

  checkAvailability: (
    email: string,
    phone: string,
  ) => Promise<{ emailTaken: boolean; phoneTaken: boolean }>;

  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    plan?: PlanTier;
    accountType?: AccountType;
    addOns?: string[];
  }) => Promise<AuthUser>;
  logIn: (identifier: string, password: string) => Promise<AuthUser>;
  logOut: () => Promise<void>;
  verifyEmail: (token: string, emailOverride?: string) => Promise<boolean>;
  resendVerification: (emailOverride?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  verifyPasswordResetOtp: (email: string, token: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string, email?: string) => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<void>;
  updateProfile: (patch: Partial<AuthUser>) => Promise<void>;
  saveOnboardingProgress: (data: {
    step?: OnboardingStep;
    accountType?: AccountType;
    plan?: PlanTier;
    billingCycle?: PlanBillingCycle;
    tin?: string;
    organization?: string;
    nin?: string;
    stateOfResidence?: string;
    employmentStatus?: string;
    onboarded?: boolean;
  }) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setRole: (role: "user" | "admin") => void;
  updatePlan: (
    plan: PlanTier,
    opts?: { accountType?: AccountType; billingCycle?: PlanBillingCycle },
  ) => void;
  refreshUser: () => Promise<void>;
  checkFeatureAccess: (feature: FeatureKey) => boolean;
  getFeatureLimit: (feature: FeatureKey) => number | null;
}

export function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) {
    return raw.replace(/[\s()-]/g, "");
  }
  if (digits.startsWith("234")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length >= 11) {
    return `+234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+234${digits}`;
  }
  return `+234${digits}`;
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

  const planRaw =
    (sub?.plan as string | undefined) ??
    (sUser.user_metadata?.desired_plan as string | undefined) ??
    "free";
  const plan: PlanTier =
    planRaw === "deluxe" || planRaw === "premium" || planRaw === "free"
      ? (planRaw as PlanTier)
      : "free";

  const fullName =
    profile?.full_name ??
    (sUser.user_metadata?.full_name as string | undefined) ??
    (sUser.user_metadata?.name as string | undefined) ??
    "";

  const phone =
    profile?.phone ??
    (sUser.user_metadata?.phone as string | undefined) ??
    sUser.phone ??
    undefined;

  const accountType =
    (profile?.account_type as AccountType | null) ??
    (sUser.user_metadata?.desired_account_type as AccountType | null) ??
    (sUser.user_metadata?.account_type as AccountType | null) ??
    null;

  const addOns =
    (profile?.add_ons as string[] | null) ??
    (sUser.user_metadata?.desired_add_ons as string[] | null) ??
    [];

  const rawStep = profile?.onboarding_step as string | undefined;
  const onboardingStep: OnboardingStep | string | null =
    rawStep === "plan" || rawStep === "filing" || rawStep === "account"
      ? rawStep
      : accountType
        ? "plan"
        : "account";

  // Background sync missing metadata into profile if profile is lacking them
  if (profile) {
    const patchSync: Record<string, unknown> = {};
    if (!profile.phone && phone) patchSync.phone = phone;
    if (!profile.account_type && accountType) patchSync.account_type = accountType;
    if ((!profile.add_ons || profile.add_ons.length === 0) && addOns.length > 0) {
      patchSync.add_ons = addOns;
    }
    if (Object.keys(patchSync).length > 0) {
      void supabase
        .from("profiles")
        .update(patchSync as never)
        .eq("id", sUser.id);
    }
  }

  return {
    id: sUser.id,
    email: sUser.email ?? profile?.email ?? "",
    fullName,
    phone,
    tin: profile?.tin ?? undefined,
    nin: profile?.nin ?? undefined,
    organization: profile?.organization ?? profile?.business_name ?? undefined,
    emailVerified: !!sUser.email_confirmed_at,
    onboarded: !!profile?.onboarded,
    onboardingStep,
    stateOfResidence: profile?.state_of_residence ?? undefined,
    employmentStatus: profile?.employment_status ?? undefined,
    role,
    createdAt: sUser.created_at ?? new Date().toISOString(),
    plan,
    accountType,
    planBillingCycle: (sub?.billing_cycle as PlanBillingCycle | null) ?? null,
    planStartDate: sub?.current_period_start ?? sub?.created_at ?? new Date().toISOString(),
    planExpiresAt: sub?.current_period_end ?? null,
    addOns,
  };
}

export const useAuth = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  loading: true,
  pendingVerificationEmail: null,

  checkAvailability: async (email: string, phone: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = normalizePhoneNumber(phone.trim());

    try {
      const response = (await supabase.rpc(
        "check_registration_availability" as never,
        {
          p_email: cleanEmail,
          p_phone: cleanPhone,
        } as never,
      )) as { data: { email_taken?: boolean; phone_taken?: boolean } | null; error: unknown };

      if (!response.error && response.data) {
        return {
          emailTaken: !!response.data.email_taken,
          phoneTaken: !!response.data.phone_taken,
        };
      }
    } catch {
      // Fallback to table lookup
    }

    // Direct fallback check
    const [emailCheck, phoneCheck] = await Promise.all([
      cleanEmail
        ? supabase.from("profiles").select("id").ilike("email", cleanEmail).maybeSingle()
        : Promise.resolve({ data: null }),
      cleanPhone
        ? supabase.from("profiles").select("id").eq("phone", cleanPhone).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    return {
      emailTaken: !!emailCheck.data,
      phoneTaken: !!phoneCheck.data,
    };
  },

  signUp: async ({ fullName, email, phone, password, plan, accountType, addOns }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = normalizePhoneNumber(phone.trim());
    const cleanName = fullName.trim();

    // 1. Backend Uniqueness check
    const availability = await get().checkAvailability(cleanEmail, cleanPhone);
    if (availability.emailTaken) {
      throw new Error("An account with this email address already exists. Please log in instead.");
    }
    if (availability.phoneTaken) {
      throw new Error(
        "This phone number is already associated with another account. Please use a different number or log in.",
      );
    }

    // 2. Generate secure 6-digit OTP code in database
    let otpCode = "";
    try {
      const { data: otpData, error: otpErr } = await (supabase.rpc as any)("generate_auth_otp", {
        p_email: cleanEmail,
        p_purpose: "signup_verification",
        p_metadata: {
          fullName: cleanName,
          phone: cleanPhone,
          plan: plan ?? "free",
          accountType: accountType ?? null,
        },
      });
      if (!otpErr && otpData && otpData.code) {
        otpCode = String(otpData.code);
      }
    } catch (e) {
      console.warn("generate_auth_otp RPC notice:", e);
    }

    // Fallback OTP if RPC not yet created in Supabase
    if (!otpCode) {
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mytaxfiling-local-otp", otpCode);
      }
    }

    // 3. Dispatch branded Resend OTP email!
    try {
      await sendVerificationOtpEmail(cleanEmail, otpCode, cleanName);
    } catch (emailErr) {
      console.warn("Resend email dispatch notice:", emailErr);
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/customer-dashboard/verify-email?email=${encodeURIComponent(cleanEmail)}`
        : undefined;

    // 4. Register the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: cleanName,
          phone: cleanPhone,
          desired_plan: plan ?? "free",
          desired_account_type: accountType ?? null,
          desired_add_ons: addOns ?? [],
        },
      },
    });

    if (error) {
      if (
        error.message.includes("User already registered") ||
        error.message.includes("already exists")
      ) {
        throw new Error(
          "An account with this email address already exists. Please log in instead.",
        );
      }
      throw new Error(error.message);
    }
    if (!data.user) throw new Error("Sign-up failed. Please try again.");

    if (typeof window !== "undefined") {
      sessionStorage.setItem("mytaxfiling-pending-verify-email", cleanEmail);
      sessionStorage.setItem("mytaxfiling-pending-phone", cleanPhone);
      sessionStorage.setItem("mytaxfiling-pending-name", cleanName);
    }

    set({ pendingVerificationEmail: cleanEmail });

    // Ensure profile row is prepared
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: cleanEmail,
      full_name: cleanName,
      phone: cleanPhone,
      account_type: accountType ?? null,
      add_ons: addOns ?? [],
      onboarded: false,
      onboarding_step: accountType ? "plan" : "account",
    });

    // If auto-confirm is enabled or session returned immediately
    if (data.session) {
      const u = await hydrateUser(data.user);
      set({ user: u, session: data.session });
      return u;
    }

    return {
      id: data.user.id,
      email: data.user.email ?? cleanEmail,
      fullName: cleanName,
      phone: cleanPhone,
      emailVerified: false,
      onboarded: false,
      onboardingStep: accountType ? "plan" : "account",
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

  logIn: async (identifier, password) => {
    const clean = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);

    let loginEmail = clean.toLowerCase();

    if (!isEmail) {
      // It's a phone number: normalize and resolve login email
      const normalizedPhone = normalizePhoneNumber(clean);
      let resolved = false;

      try {
        const response = (await supabase.rpc(
          "get_login_identifier" as never,
          {
            p_identifier: normalizedPhone,
          } as never,
        )) as { data: { found?: boolean; email?: string } | null };

        if (response.data?.found && response.data.email) {
          loginEmail = response.data.email.toLowerCase();
          resolved = true;
        }
      } catch {
        // Fallback below
      }

      if (!resolved) {
        // Try looking up directly in profiles table by phone
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .or(`phone.eq.${normalizedPhone},phone.eq.${clean},phone.eq.${clean.replace(/^\+/, "")}`)
          .maybeSingle();

        if (profile?.email) {
          loginEmail = profile.email.toLowerCase();
          resolved = true;
        } else {
          // As last attempt, try Supabase native phone signin
          const { data: phoneAuthData, error: phoneAuthError } =
            await supabase.auth.signInWithPassword({
              phone: normalizedPhone,
              password,
            });

          if (!phoneAuthError && phoneAuthData.user) {
            const u = await hydrateUser(phoneAuthData.user);
            set({ user: u, session: phoneAuthData.session });
            return u;
          }
          throw new Error(
            "No account found associated with this phone number. Please check and try again.",
          );
        }
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_grant")
      ) {
        throw new Error(
          isEmail
            ? "Incorrect email or password. Please verify your details."
            : "Incorrect phone number or password. Please verify your details.",
        );
      }
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("No account found for these credentials.");
    }

    if (!data.user.email_confirmed_at) {
      const pending = data.user.email ?? loginEmail;
      set({ pendingVerificationEmail: pending });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mytaxfiling-pending-verify-email", pending);
      }
    }

    const u = await hydrateUser(data.user);
    set({ user: u, session: data.session });
    return u;
  },

  logOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Proceed even if network request fails
    }
    set({ user: null, session: null, pendingVerificationEmail: null });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mytaxfiling-pending-verify-email");
      sessionStorage.removeItem("mytaxfiling-pending-phone");
      sessionStorage.removeItem("mytaxfiling-reset-email");
    }
  },

  verifyEmail: async (token, emailOverride) => {
    let email = emailOverride ?? get().pendingVerificationEmail ?? get().user?.email;
    if (!email && typeof window !== "undefined") {
      email = sessionStorage.getItem("mytaxfiling-pending-verify-email");
    }
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    let isVerified = false;

    // 1. Verify custom Resend OTP via database RPC
    try {
      const { data: verifyData, error: verifyErr } = await (supabase.rpc as any)(
        "verify_auth_otp",
        {
          p_email: cleanEmail,
          p_code: cleanToken,
          p_purpose: "signup_verification",
        },
      );
      if (!verifyErr && verifyData && verifyData.success) {
        isVerified = true;
      }
    } catch (e) {
      console.warn("verify_auth_otp RPC notice:", e);
    }

    // Check local fallback OTP if offline/simulated
    if (!isVerified && typeof window !== "undefined") {
      const localOtp = sessionStorage.getItem("mytaxfiling-local-otp");
      if (localOtp && localOtp === cleanToken) {
        isVerified = true;
      }
    }

    // 2. Secondary fallback: check native Supabase auth verifyOtp
    if (!isVerified) {
      let verifyRes = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: "signup",
      });
      if (verifyRes.error || !verifyRes.data.user) {
        const fallback = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: "email",
        });
        if (!fallback.error && fallback.data.user) {
          verifyRes = fallback;
        }
      }
      if (!verifyRes.error && verifyRes.data.user) {
        isVerified = true;
      }
    }

    if (!isVerified) return false;

    // Retrieve active user or session
    const { data: userData } = await supabase.auth.getUser();
    const sUser = userData?.user;

    const storedPhone =
      typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-pending-phone") : null;
    const storedName =
      typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-pending-name") : null;

    if (sUser) {
      const meta = sUser.user_metadata || {};
      const phoneToSave = meta.phone || storedPhone || null;

      await supabase.from("profiles").upsert({
        id: sUser.id,
        email: cleanEmail,
        full_name: meta.full_name || meta.name || storedName || null,
        phone: phoneToSave,
        account_type: meta.desired_account_type || meta.account_type || null,
        add_ons: meta.desired_add_ons || meta.add_ons || [],
        onboarding_step: meta.desired_account_type ? "plan" : "account",
      });

      if (meta.desired_plan && meta.desired_plan !== "free") {
        await supabase.from("subscriptions").upsert(
          {
            user_id: sUser.id,
            plan: meta.desired_plan,
            status: "active",
          },
          { onConflict: "user_id" },
        );
      }

      const u = await hydrateUser(sUser);
      set({ user: u, pendingVerificationEmail: null });

      // Dispatch branded Welcome Email via Resend
      sendWelcomeEmail({ email: cleanEmail, fullName: u.fullName, id: u.id }).catch(() => {});
    }

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mytaxfiling-pending-verify-email");
      sessionStorage.removeItem("mytaxfiling-pending-phone");
      sessionStorage.removeItem("mytaxfiling-pending-name");
      sessionStorage.removeItem("mytaxfiling-local-otp");
    }

    return true;
  },

  resendVerification: async (emailOverride) => {
    let email = emailOverride ?? get().pendingVerificationEmail ?? get().user?.email;
    if (!email && typeof window !== "undefined") {
      email = sessionStorage.getItem("mytaxfiling-pending-verify-email");
    }
    if (!email) throw new Error("No pending email to verify.");
    const cleanEmail = email.trim().toLowerCase();

    const storedName =
      (typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-pending-name") : null) ||
      get().user?.fullName;

    // 1. Generate fresh 6-digit OTP in database
    let newOtp = "";
    try {
      const { data: otpData, error: otpErr } = await (supabase.rpc as any)("generate_auth_otp", {
        p_email: cleanEmail,
        p_purpose: "signup_verification",
      });
      if (!otpErr && otpData && otpData.code) {
        newOtp = String(otpData.code);
      }
    } catch (e) {
      console.warn("generate_auth_otp RPC notice:", e);
    }

    if (!newOtp) {
      newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mytaxfiling-local-otp", newOtp);
      }
    }

    // 2. Dispatch branded email through Resend!
    await sendResendVerificationOtpEmail(cleanEmail, newOtp, storedName || undefined);
  },

  requestPasswordReset: async (email) => {
    const cleanEmail = email.trim().toLowerCase();

    if (typeof window !== "undefined") {
      sessionStorage.setItem("mytaxfiling-reset-email", cleanEmail);
    }

    // 1. Generate 6-digit OTP code in database
    let otpCode = "";
    try {
      const { data: otpData, error: otpErr } = await (supabase.rpc as any)("generate_auth_otp", {
        p_email: cleanEmail,
        p_purpose: "password_reset",
      });
      if (!otpErr && otpData && otpData.code) {
        otpCode = String(otpData.code);
      }
    } catch (e) {
      console.warn("generate_auth_otp RPC notice:", e);
    }

    if (!otpCode) {
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mytaxfiling-reset-otp", otpCode);
      }
    }

    // 2. Dispatch branded recovery email via Resend!
    await sendPasswordResetOtpEmail(cleanEmail, otpCode);

    return null;
  },

  verifyPasswordResetOtp: async (email, token) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    try {
      const { data, error } = await (supabase.rpc as any)("verify_auth_otp", {
        p_email: cleanEmail,
        p_code: cleanToken,
        p_purpose: "password_reset",
      });
      if (!error && data && data.success) {
        return true;
      }
    } catch (e) {
      console.warn("verify_auth_otp notice:", e);
    }

    // Local check fallback
    if (typeof window !== "undefined") {
      const local = sessionStorage.getItem("mytaxfiling-reset-otp");
      if (local && local === cleanToken) return true;
    }

    // Supabase native fallback
    const { data: supData, error: supErr } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: "recovery",
    });
    if (!supErr && supData.session) {
      set({ session: supData.session });
      return true;
    }

    throw new Error("Invalid or expired recovery code. Please check your email.");
  },

  resetPassword: async (tokenOrEmpty, newPassword, email) => {
    const cleanEmail = (
      email ||
      (typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-reset-email") : null) ||
      ""
    )
      .trim()
      .toLowerCase();

    let success = false;

    // 1. Attempt password reset with OTP via database RPC
    if (tokenOrEmpty && cleanEmail) {
      try {
        const { data, error } = await (supabase.rpc as any)("reset_password_with_otp", {
          p_email: cleanEmail,
          p_code: tokenOrEmpty.trim(),
          p_new_password: newPassword,
        });
        if (!error && data && data.success) {
          success = true;
        } else if (data && !data.success && data.error) {
          throw new Error(data.error);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("Invalid")) throw err;
      }
    }

    // 2. Fallback via active session updateUser
    if (!success) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) success = true;
    }

    if (!success) {
      throw new Error("Could not update password. Please check your recovery code and try again.");
    }

    // 3. Dispatch Password Changed Security Alert via Resend
    if (cleanEmail) {
      sendPasswordChangedEmail(cleanEmail).catch(() => {});
    }

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mytaxfiling-reset-email");
      sessionStorage.removeItem("mytaxfiling-reset-otp");
    }

    return true;
  },

  changePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    return true;
  },

  deleteAccount: async () => {
    const u = get().user;
    if (!u) throw new Error("Not authenticated");

    const { error: rpcErr } = await supabase.rpc("delete_user_account" as never);
    if (rpcErr) {
      console.warn("delete_user_account RPC error, executing direct deletions:", rpcErr);
      await supabase.from("profiles").delete().eq("id", u.id);
    }
    await supabase.auth.signOut();
    set({ user: null, session: null, pendingVerificationEmail: null });
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  },

  updateProfile: async (patch) => {
    const u = get().user;
    if (!u) return;
    const merged = { ...u, ...patch };
    set({ user: merged });

    const dbPatch: Record<string, unknown> = {};
    if (patch.fullName !== undefined) dbPatch.full_name = patch.fullName;
    if (patch.email !== undefined) dbPatch.email = patch.email;
    if (patch.phone !== undefined) dbPatch.phone = patch.phone;
    if (patch.tin !== undefined) dbPatch.tin = patch.tin;
    if (patch.organization !== undefined) {
      dbPatch.organization = patch.organization ?? null;
      dbPatch.business_name = patch.organization ?? null;
    }
    if (patch.accountType !== undefined) dbPatch.account_type = patch.accountType;
    if (patch.addOns !== undefined) dbPatch.add_ons = patch.addOns;
    if (patch.onboarded !== undefined) dbPatch.onboarded = patch.onboarded;
    if (patch.onboardingStep !== undefined) dbPatch.onboarding_step = patch.onboardingStep;
    if (patch.nin !== undefined) dbPatch.nin = patch.nin;
    if (patch.stateOfResidence !== undefined) dbPatch.state_of_residence = patch.stateOfResidence;
    if (patch.employmentStatus !== undefined) dbPatch.employment_status = patch.employmentStatus;

    if (Object.keys(dbPatch).length > 0) {
      const { error } = await supabase
        .from("profiles")
        .update(dbPatch as never)
        .eq("id", u.id);
      if (error) console.error("Error updating profile in Supabase:", error);
    }
  },

  saveOnboardingProgress: async (data) => {
    const u = get().user;
    if (!u) return;

    const patch: Partial<AuthUser> = {};
    const dbPatch: Record<string, unknown> = {};

    if (data.step) {
      patch.onboardingStep = data.step;
      dbPatch.onboarding_step = data.step;
    }
    if (data.accountType) {
      patch.accountType = data.accountType;
      dbPatch.account_type = data.accountType;
    }
    if (data.tin !== undefined) {
      patch.tin = data.tin;
      dbPatch.tin = data.tin;
    }
    if (data.organization !== undefined) {
      patch.organization = data.organization;
      dbPatch.organization = data.organization;
      dbPatch.business_name = data.organization;
    }
    if (data.nin !== undefined) {
      patch.nin = data.nin;
      dbPatch.nin = data.nin;
    }
    if (data.stateOfResidence !== undefined) {
      patch.stateOfResidence = data.stateOfResidence;
      dbPatch.state_of_residence = data.stateOfResidence;
    }
    if (data.employmentStatus !== undefined) {
      patch.employmentStatus = data.employmentStatus;
      dbPatch.employment_status = data.employmentStatus;
    }
    if (data.onboarded !== undefined) {
      patch.onboarded = data.onboarded;
      dbPatch.onboarded = data.onboarded;
    }

    if (data.plan) {
      get().updatePlan(data.plan, {
        accountType: data.accountType ?? u.accountType ?? undefined,
        billingCycle: data.billingCycle,
      });
    }

    set({ user: { ...u, ...patch } });

    if (Object.keys(dbPatch).length > 0) {
      await supabase
        .from("profiles")
        .update(dbPatch as never)
        .eq("id", u.id);
    }
  },

  completeOnboarding: async () => {
    const u = get().user;
    if (!u) return;
    set({ user: { ...u, onboarded: true, onboardingStep: "filing" } });
    await supabase
      .from("profiles")
      .update({ onboarded: true, onboarding_step: "filing" } as never)
      .eq("id", u.id);
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
      void supabase
        .from("profiles")
        .update({ account_type: opts.accountType } as never)
        .eq("id", u.id);
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

  checkFeatureAccess: (feature: FeatureKey) => {
    const u = get().user;
    return canAccess(feature, u?.plan);
  },

  getFeatureLimit: (feature: FeatureKey) => {
    const u = get().user;
    return getLimit(feature, u?.plan);
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
      useAuth.setState({
        user: null,
        session: null,
        pendingVerificationEmail: null,
      });
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
