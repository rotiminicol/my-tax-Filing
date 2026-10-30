import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SignupLayout from "@/components/auth/SignupLayout";
import SignupField, { signupInputBlur, signupInputFocus } from "@/components/auth/SignupField";
import { useAuth, type PlanTier, type AccountType } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";
import { notify } from "@/components/Toaster";
import { z } from "zod";
import { Zap, Star, Check, ArrowLeft, ArrowRight } from "lucide-react";

const INK = "#18623f";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const MINT = "#d5f5c2";

const signupSearchSchema = z.object({
  plan: z.enum(["free", "deluxe", "premium"]).optional(),
  accountType: z.enum(["individual", "organization"]).optional(),
  addon: z.string().optional(),
});

const SIGNUP_FORM_STATE_KEY = "mytaxfiling-signup-form";

type SignupFormState = {
  form: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  agree: boolean;
};

const PLAN_META: Record<string, { label: string; price: string; cadence: string; bg: string }> = {
  free: { label: "Free", price: "₦0", cadence: "Forever free", bg: MINT },
  deluxe: { label: "Deluxe", price: "₦50,000", cadence: "per year", bg: TEAL },
  premium: { label: "Premium", price: "₦200,000", cadence: "per year", bg: YELLOW },
};

function NigeriaFlag() {
  return (
    <svg className="w-6 h-4 shrink-0" viewBox="0 0 24 16" aria-hidden>
      <rect width="8" height="16" fill="#008751" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#008751" />
    </svg>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [_searchParams] = useSearchParams();
  const plan = _searchParams.get("plan") as PlanTier | null;
  const urlAccountType = _searchParams.get("accountType") as AccountType | null;
  const addon = _searchParams.get("addon");
  const signUp = useAuth((s) => s.signUp);

  const loadSavedSignup = (): SignupFormState | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(SIGNUP_FORM_STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SignupFormState;
    } catch {
      return null;
    }
  };

  const savedSignup = loadSavedSignup();

  const [form, setForm] = useState(() =>
    savedSignup?.form ?? {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }
  );

  const passwordRequirements = [
    { text: "At least 8 characters", met: form.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { text: "One lowercase letter", met: /[a-z]/.test(form.password) },
    { text: "One number", met: /[0-9]/.test(form.password) },
    { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/.test(form.password) },
  ];
  const unmetRequirements = passwordRequirements.filter((r) => !r.met);

  const [agree, setAgree] = useState(() => savedSignup?.agree ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      SIGNUP_FORM_STATE_KEY,
      JSON.stringify({ form, agree })
    );
  }, [form, agree]);

  const selectedPlan = plan as PlanTier | undefined;
  const selectedAccountType = urlAccountType as AccountType | undefined;
  const planInfo = selectedPlan ? PLAN_META[selectedPlan] : null;

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (form.fullName.trim().length < 2) {
      errs.fullName = "Full name is required.";
    } else if (!form.fullName.trim().includes(" ")) {
      errs.fullName = "Please enter your first and last name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }

    const p = form.password;
    if (p.length < 8) errs.password = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(p)) errs.password = "Must include at least one uppercase letter.";
    else if (!/[a-z]/.test(p)) errs.password = "Must include at least one lowercase letter.";
    else if (!/[0-9]/.test(p)) errs.password = "Must include at least one number.";
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/.test(p)) errs.password = "Must include at least one special character.";

    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match.";
    if (!agree) errs.agree = "You must accept the terms to continue.";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    useLoadingStore.getState().showLoader("Creating your account...");
    try {
      const addOns = addon ? [addon] : [];
      const u = await signUp({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        plan: selectedPlan,
        accountType: selectedAccountType,
        addOns,
      });
      notify.success("Account created", `Welcome, ${u.fullName}. Verify your email next.`);
      sessionStorage.removeItem(SIGNUP_FORM_STATE_KEY);
      navigate("/customer-dashboard/verify-email");
    } catch (err) {
      notify.error("Sign-up failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
      useLoadingStore.getState().hideLoader();
    }
  };

  return (
    <SignupLayout>
      <div className="w-full max-w-md flex flex-col gap-6 py-4">
        <header className="flex flex-col gap-1">
          <p
            className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
            style={{ fontFamily: "'Roboto Mono', monospace", color: INK, opacity: 0.5 }}
          >
            Create Account
          </p>
          <h1
            className="text-3xl font-black uppercase leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
          >
            Join the
            <br />
            Elite.
          </h1>
        </header>

        {planInfo && (
          <div
            className="flex items-center gap-3 px-4 py-4"
            style={{
              backgroundColor: planInfo.bg,
              borderRadius: 12,
              border: "1.5px solid rgba(26,51,0,0.10)",
            }}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{ backgroundColor: "rgba(26,51,0,0.10)" }}
            >
              {selectedPlan === "premium" ? (
                <Star className="w-4 h-4" style={{ color: INK }} />
              ) : selectedPlan === "deluxe" ? (
                <Zap className="w-4 h-4" style={{ color: INK }} />
              ) : (
                <Check className="w-4 h-4" style={{ color: INK }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] font-black uppercase tracking-[0.15em] opacity-50"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                Selected Plan
              </p>
              <p className="text-sm font-black" style={{ color: INK }}>
                {planInfo.label} — {planInfo.price}{" "}
                <span className="font-semibold opacity-60 text-xs">{planInfo.cadence}</span>
              </p>
            </div>
            <Link
              to="/"
              className="text-[10px] font-black uppercase tracking-[0.12em] flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
            >
              <ArrowLeft className="w-3 h-3" /> Change
            </Link>
          </div>
        )}

        {selectedAccountType && (
          <div className="flex flex-wrap gap-2">
            <span
              className="inline-flex items-center px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: TEAL,
                color: INK,
                borderRadius: 6,
                border: "1.5px solid rgba(26,51,0,0.10)",
              }}
            >
              {selectedAccountType === "organization" ? "Organization" : "Individual"}
            </span>
            {addon === "pro-review" && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  backgroundColor: MINT,
                  color: INK,
                  borderRadius: 6,
                  border: "1.5px solid rgba(26,51,0,0.10)",
                }}
              >
                <Check className="w-3 h-3" /> Pro Review
              </span>
            )}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <SignupField
            label="Full Name"
            autoComplete="name"
            placeholder="John Doe"
            value={form.fullName}
            onChange={upd("fullName")}
            error={errors.fullName}
          />

          <SignupField
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={upd("email")}
            error={errors.email}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: INK }}>Phone Number</label>
            <div className="flex items-center gap-2 border-b-[3px]" style={{ borderColor: INK }}>
              <NigeriaFlag />
              <span className="text-base font-bold pb-2" style={{ color: INK }}>+234</span>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="801 234 5678"
                value={form.phone}
                onChange={upd("phone")}
                onFocus={signupInputFocus}
                onBlur={signupInputBlur}
                className="flex-1 bg-transparent p-3 pl-1 text-base font-bold transition-all outline-none"
                style={{ color: INK }}
              />
            </div>
          </div>

          <SignupField
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password}
            onChange={upd("password")}
            error={errors.password}
          />

          {form.password && unmetRequirements.length > 0 && (
            <div className="flex flex-col gap-1 -mt-2">
              {unmetRequirements.map((req, i) => (
                <p key={i} className="text-[11px] font-semibold opacity-60" style={{ color: INK }}>
                  {req.text}
                </p>
              ))}
            </div>
          )}

          <SignupField
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={upd("confirmPassword")}
            error={errors.confirmPassword}
          />

          <label htmlFor="agree-checkbox" className="flex items-start gap-3 mt-1 cursor-pointer select-none">
            <input
              id="agree-checkbox"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="sr-only"
            />
            <div
              className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border-2 transition-all"
              style={{
                borderColor: INK,
                borderRadius: 3,
                backgroundColor: agree ? INK : "transparent",
              }}
            >
              {agree && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs leading-relaxed font-semibold" style={{ color: INK, opacity: 0.7 }}>
              I agree to the{" "}
              <Link to="/legal/terms" className="font-black underline hover:no-underline" style={{ color: INK }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/legal/privacy" className="font-black underline hover:no-underline" style={{ color: INK }}>
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agree && <p className="text-[11px] font-semibold text-red-600 -mt-2">{errors.agree}</p>}

          <button
            type="submit"
            disabled={busy}
            className="group w-full mt-2 h-12 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 11,
              backgroundColor: YELLOW,
              color: INK,
              borderRadius: 6,
            }}
          >
            {busy ? "Creating account…" : "Start Filing"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="text-center text-sm font-semibold" style={{ color: INK }}>
          Already have an account?{" "}
          <Link
            to="/customer-dashboard/login"
            className="font-black underline hover:no-underline"
            style={{ color: INK }}
          >
            Log in
          </Link>
        </p>
      </div>
    </SignupLayout>
  );
}

export default SignupPage;
