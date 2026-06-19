import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AuthFocusedLayout from "@/components/auth/AuthFocusedLayout";
import AuthInput from "@/components/auth/AuthInput";
import { useAuth } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";
import { notify } from "@/components/Toaster";
import { z } from "zod";

const INK = "#1a3300";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const MINT = "#d5f5c2";
const BLUSH = "#f6d0ff";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
  plan: z.enum(["free", "deluxe", "premium"]).optional(),
});

function NigeriaFlag() {
  return (
    <svg className="w-6 h-4 shrink-0" viewBox="0 0 24 16" aria-hidden>
      <rect width="8" height="16" fill="#008751" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#008751" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [_searchParams] = useSearchParams();
  const redirect = _searchParams.get("redirect");
  const plan = _searchParams.get("plan") as "free" | "deluxe" | "premium" | null;
  const logIn = useAuth((s) => s.logIn);
  const updatePlan = useAuth((s) => s.updatePlan);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /[0-9]/.test(password) },
    { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/.test(password) },
  ];
  const unmetRequirements = passwordRequirements.filter((r) => !r.met);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    let loginIdentifier = identifier.trim();

    if (loginMethod === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier)) {
        errs.identifier = "Enter the email address registered to your account.";
      }
    } else {
      loginIdentifier = "+234" + loginIdentifier.replace(/\D/g, "");
      if (!/^\d{10,}$/.test(identifier.replace(/\D/g, ""))) {
        errs.identifier = "Enter a valid phone number.";
      }
    }

    if (password.length < 1) errs.password = "Password is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    useLoadingStore.getState().showLoader("Verifying credentials...");
    try {
      const u = await logIn(loginIdentifier, password);

      if (u.role !== "user") {
        useAuth.getState().logOut();
        throw new Error("No account found for this email.");
      }

      if (!u.emailVerified) {
        notify.info("Verify your email", "Enter the 6-character code to activate your account.");
        navigate("/customer-dashboard/verify-email");
        return;
      }

      if (plan && plan !== u.plan) {
        updatePlan(plan);
        notify.success("Plan Updated", `Switched to the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`);
      }

      notify.success("Welcome back", `Signed in as ${u.fullName}.`);
      navigate(redirect || "/customer-dashboard/receipts");
    } catch (err) {
      notify.error("Sign-in failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
      useLoadingStore.getState().hideLoader();
    }
  };

  return (
    <AuthFocusedLayout headerVariant="login">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[960px] grid md:grid-cols-2 gap-8 items-center">
          {/* Left panel */}
          <div className="hidden md:flex flex-col gap-8">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.25em] mb-3"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK, opacity: 0.5 }}
              >
                Nigerian Tax Compliance
              </p>
              <h1
                className="text-5xl font-black uppercase leading-[1.05]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Welcome
                <br />
                Back.
              </h1>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { bg: TEAL, label: "PIT Returns", sub: "Auto-calculated in minutes" },
                { bg: MINT, label: "E-Invoicing", sub: "FIRS-compliant every time" },
                { bg: BLUSH, label: "Document Renewal", sub: "Never miss a deadline again" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{
                    backgroundColor: item.bg,
                    borderRadius: 12,
                    border: "1.5px solid rgba(26,51,0,0.10)",
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-black" style={{ color: INK }}>{item.label}</p>
                    <p className="text-xs font-medium opacity-70" style={{ color: INK }}>{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-40" style={{ color: INK }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div
            className="w-full p-8 md:p-10"
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              border: "1.5px solid rgba(26,51,0,0.10)",
            }}
          >
            <div className="mb-8">
              <h2
                className="text-2xl font-black uppercase"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Log In
              </h2>
              {plan && (
                <div
                  className="mt-3 px-4 py-3 text-sm font-bold"
                  style={{
                    backgroundColor: YELLOW,
                    borderRadius: 8,
                    color: INK,
                  }}
                >
                  Sign in to activate the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
                </div>
              )}
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              {/* Method tabs */}
              <div
                className="flex gap-1 p-1"
                style={{
                  backgroundColor: "rgba(26,51,0,0.06)",
                  borderRadius: 8,
                }}
              >
                {(["email", "phone"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLoginMethod(m)}
                    className="flex-1 py-2 text-xs font-black uppercase tracking-[0.15em] transition-all"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      borderRadius: 6,
                      backgroundColor: loginMethod === m ? INK : "transparent",
                      color: loginMethod === m ? "#fff" : INK,
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {loginMethod === "email" ? (
                <AuthInput
                  label="Email Address"
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  error={errors.identifier}
                  trailingIcon="person"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold" style={{ color: INK }}>Phone Number</label>
                  <div className="flex items-center gap-2 border-b-[3px] pb-2" style={{ borderColor: INK }}>
                    <NigeriaFlag />
                    <span className="text-base font-bold" style={{ color: INK }}>+234</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="801 234 5678"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="flex-1 bg-transparent text-base font-bold outline-none"
                      style={{ color: INK }}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="text-[11px] font-semibold text-red-600">{errors.identifier}</p>
                  )}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold" style={{ color: INK }}>Password</span>
                  <Link
                    to="/customer-dashboard/forgot-password"
                    className="text-[11px] font-black uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                    style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                  >
                    Forgot?
                  </Link>
                </div>
                <AuthInput
                  label=""
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  trailingIcon="password"
                />
                {password && unmetRequirements.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {unmetRequirements.map((req, i) => (
                      <p key={i} className="text-[11px] font-semibold opacity-60" style={{ color: INK }}>
                        {req.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="group w-full h-12 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 11,
                  backgroundColor: YELLOW,
                  color: INK,
                  borderRadius: 6,
                }}
              >
                {busy ? "Signing in…" : "Log In"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-center text-sm font-semibold" style={{ color: INK }}>
                No account?{" "}
                <Link
                  to="/customer-dashboard/signup"
                  className="font-black underline hover:no-underline"
                  style={{ color: INK }}
                >
                  Sign up free
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </AuthFocusedLayout>
  );
}

export default LoginPage;
