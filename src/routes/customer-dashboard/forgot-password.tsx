import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Mail, KeyRound } from "lucide-react";
import AuthFocusedLayout from "@/components/auth/AuthFocusedLayout";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";

const INK = "#18623f";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";

function ForgotPage() {
  const navigate = useNavigate();
  const requestReset = useAuth((s) => s.requestPasswordReset);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    setBusy(true);

    try {
      await requestReset(cleanEmail);
      setSent(true);
      notify.info(
        "Check your inbox",
        "If an account exists, a reset code and link have been sent.",
      );
    } catch {
      notify.error("Request failed", "Unable to initiate password reset. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFocusedLayout headerVariant="forgot">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[440px] p-8 md:p-10"
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1.5px solid rgba(26,51,0,0.10)",
          }}
        >
          {!sent ? (
            <>
              <div className="flex flex-col gap-3 mb-8">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: TEAL, borderRadius: 12 }}
                >
                  <Mail className="w-6 h-6" style={{ color: INK }} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.25em] mb-1 opacity-50"
                    style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                  >
                    Account Recovery
                  </p>
                  <h1
                    className="text-2xl font-black uppercase"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
                  >
                    Forgot Password?
                  </h1>
                  <p
                    className="text-sm font-semibold mt-2 leading-relaxed opacity-60"
                    style={{ color: INK }}
                  >
                    No worries. Enter your registered email and we'll send you a verification code
                    and recovery link.
                  </p>
                </div>
              </div>

              <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-bold" style={{ color: INK }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(undefined);
                    }}
                    placeholder="you@example.com"
                    className="w-full border-b-[3px] bg-transparent pb-2 text-base font-bold outline-none transition-all"
                    style={{ borderColor: INK, color: INK }}
                  />
                  {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
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
                  {busy ? "Sending…" : "Send Reset Link & OTP"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <Link
                  to="/customer-dashboard/login"
                  className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </form>
            </>
          ) : (
            <div className="flex flex-col gap-6">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{ backgroundColor: TEAL, borderRadius: 12 }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: INK }} />
              </div>

              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.25em] mb-1 opacity-50"
                  style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                >
                  Code & Link Dispatched
                </p>
                <h2
                  className="text-2xl font-black uppercase"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
                >
                  Check Your Inbox
                </h2>
                <p
                  className="text-sm font-semibold mt-2 leading-relaxed opacity-60"
                  style={{ color: INK }}
                >
                  We sent a recovery email with a verification OTP to{" "}
                  <span className="font-black opacity-100">{email}</span>.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/customer-dashboard/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`,
                    )
                  }
                  className="group w-full h-12 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: 11,
                    backgroundColor: YELLOW,
                    color: INK,
                    borderRadius: 6,
                  }}
                >
                  <KeyRound className="w-4 h-4" />
                  Enter Reset OTP Code
                </button>

                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="w-full h-10 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all hover:opacity-70 text-[11px]"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    color: INK,
                  }}
                >
                  Resend Email
                </button>
              </div>

              <p className="text-xs font-semibold text-center opacity-50" style={{ color: INK }}>
                Didn't receive it? Check your spam or junk folder.
              </p>

              <Link
                to="/customer-dashboard/login"
                className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthFocusedLayout>
  );
}

export default ForgotPage;
