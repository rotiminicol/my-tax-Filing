import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle, Circle, ArrowRight, Loader2 } from "lucide-react";
import AuthFocusedLayout from "@/components/auth/AuthFocusedLayout";
import AuthInput from "@/components/auth/AuthInput";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";
import { supabase } from "@/integrations/supabase/client";

const INK = "#18623f";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const MINT = "#d5f5c2";
const BLUSH = "#f6d0ff";

function strengthScore(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (pwd.length > 12 && s >= 3) return 4;
  return s;
}

const BAR_COLORS = ["#ef4444", "#f97316", "#84cc16", INK];

function ResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reset = useAuth((s) => s.resetPassword);

  const queryEmail = searchParams.get("email");
  const storedEmail =
    typeof window !== "undefined" ? sessionStorage.getItem("mytaxfiling-reset-email") : null;

  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(queryEmail || storedEmail || "");
  const [otp, setOtp] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setHasSession(true);
      }
      setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasSession(true);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const passwordRequirements = [
    { text: "At least 8 characters", met: pwd.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(pwd) },
    { text: "One lowercase letter", met: /[a-z]/.test(pwd) },
    { text: "One number", met: /[0-9]/.test(pwd) },
    { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/.test(pwd) },
  ];
  const unmetRequirements = passwordRequirements.filter((r) => !r.met);
  const score = useMemo(() => strengthScore(pwd), [pwd]);
  const matchError = confirm.length > 0 && pwd !== confirm;

  const strengthLabel = () => {
    if (!pwd.length) return { text: "Enter password", opacity: 0.4 };
    if (score === 1) return { text: "Weak", opacity: 1 };
    if (score === 2) return { text: "Fair", opacity: 1 };
    if (score === 3) return { text: "Good", opacity: 1 };
    return { text: "Excellent", opacity: 1 };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};

    if (!hasSession) {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        next.email = "Please enter your registered email address.";
      }
      if (!otp.trim()) {
        next.otp = "Please enter the 6-digit recovery OTP from your email.";
      }
    }

    if (pwd.length < 8) next.pwd = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(pwd)) next.pwd = "Must include at least one uppercase letter.";
    else if (!/[a-z]/.test(pwd)) next.pwd = "Must include at least one lowercase letter.";
    else if (!/[0-9]/.test(pwd)) next.pwd = "Must include at least one number.";
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/.test(pwd))
      next.pwd = "Must include at least one special character.";

    if (pwd !== confirm) next.confirm = "Passwords do not match.";

    setErrs(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      // If we don't have an active session, pass the OTP code and email
      const tokenToPass = hasSession ? "" : otp.trim();
      const emailToPass = hasSession ? undefined : email.trim().toLowerCase();

      await reset(tokenToPass, pwd, emailToPass);
      notify.success("Password updated", "Your new password is now active.");
      navigate("/customer-dashboard/reset-password-success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password reset failed. Please try again.";
      notify.error("Reset Failed", msg);
      setErrs({ form: msg });
    } finally {
      setBusy(false);
    }
  };

  const label = strengthLabel();

  return (
    <AuthFocusedLayout headerVariant="reset">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[880px] grid md:grid-cols-2 gap-8 items-start">
          {/* Left: info panel */}
          <div className="hidden md:flex flex-col gap-6">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-50"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                Secure Authentication
              </p>
              <h1
                className="text-4xl font-black uppercase leading-[1.05]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Strengthen
                <br />
                Your Gateway.
              </h1>
              <p
                className="text-sm font-semibold mt-3 leading-relaxed opacity-60"
                style={{ color: INK }}
              >
                Create a strong, unique password to keep your tax compliance and financial records
                protected.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { bg: TEAL, title: "End-to-End Encryption", sub: "256-bit AES for all documents" },
                { bg: MINT, title: "Secure Recovery", sub: "OTP & multi-factor verification" },
                { bg: BLUSH, title: "Zero Data Leaks", sub: "NDPR-compliant infrastructure" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="px-4 py-4"
                  style={{
                    backgroundColor: item.bg,
                    borderRadius: 12,
                    border: "1.5px solid rgba(26,51,0,0.10)",
                  }}
                >
                  <p className="text-sm font-black" style={{ color: INK }}>
                    {item.title}
                  </p>
                  <p className="text-xs font-semibold opacity-60" style={{ color: INK }}>
                    {item.sub}
                  </p>
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
            <div className="mb-7">
              <p
                className="text-[10px] font-black uppercase tracking-[0.25em] mb-1 opacity-50"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                Security Check
              </p>
              <h2
                className="text-2xl font-black uppercase"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Reset Password
              </h2>
              <p className="text-sm font-semibold mt-1.5 opacity-60" style={{ color: INK }}>
                {hasSession
                  ? "Enter and confirm your new password."
                  : "Enter the OTP code sent to your email to verify your identity and set a new password."}
              </p>
            </div>

            {errs.form && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {errs.form}
              </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              {!hasSession && (
                <>
                  <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errs.email) setErrs({ ...errs, email: "" });
                    }}
                    error={errs.email}
                    autoComplete="email"
                  />

                  <AuthInput
                    label="Password Reset OTP"
                    placeholder="Enter 6-digit recovery code"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errs.otp) setErrs({ ...errs, otp: "" });
                    }}
                    error={errs.otp}
                    autoComplete="one-time-code"
                  />
                </>
              )}

              <div>
                <AuthInput
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={pwd}
                  onChange={(e) => {
                    setPwd(e.target.value);
                    if (errs.pwd) setErrs({ ...errs, pwd: "" });
                  }}
                  error={errs.pwd}
                  trailingIcon="password"
                />

                {pwd && unmetRequirements.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {unmetRequirements.map((req, i) => (
                      <p
                        key={i}
                        className="text-[11px] font-semibold opacity-60"
                        style={{ color: INK }}
                      >
                        {req.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* Strength bar */}
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            pwd.length && i < score
                              ? BAR_COLORS[Math.min(score - 1, 3)]
                              : "rgba(26,51,0,0.10)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-black uppercase tracking-[0.12em]"
                      style={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: INK,
                        opacity: label.opacity,
                      }}
                    >
                      {label.text}
                    </span>
                    <div className="flex gap-3">
                      {[
                        { check: pwd.length >= 8, text: "8+ chars" },
                        { check: /[^A-Za-z0-9]/.test(pwd), text: "Symbol" },
                      ].map((item) => (
                        <span
                          key={item.text}
                          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em]"
                          style={{
                            fontFamily: "'Roboto Mono', monospace",
                            color: INK,
                            opacity: item.check ? 1 : 0.3,
                          }}
                        >
                          {item.check ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Circle className="w-3 h-3" />
                          )}
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <AuthInput
                  label="Confirm New Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (errs.confirm) setErrs({ ...errs, confirm: "" });
                  }}
                  error={errs.confirm}
                  trailingIcon="password"
                />
                {matchError && (
                  <p className="text-[11px] font-semibold text-red-600 mt-1">
                    Passwords do not match
                  </p>
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
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.15em]">
                <Link
                  to="/customer-dashboard/forgot-password"
                  className="hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                >
                  Resend OTP Code
                </Link>

                <Link
                  to="/customer-dashboard/login"
                  className="flex items-center gap-1.5 hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthFocusedLayout>
  );
}

export default ResetPage;
