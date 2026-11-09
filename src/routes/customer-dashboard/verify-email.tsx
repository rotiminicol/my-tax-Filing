import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Mail, ArrowRight, RotateCw } from "lucide-react";
import AuthFocusedLayout from "@/components/auth/AuthFocusedLayout";
import AuthInput from "@/components/auth/AuthInput";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";

const INK = "#18623f";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const MINT = "#d5f5c2";

function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuth((s) => s.user);
  const pendingEmail = useAuth((s) => s.pendingVerificationEmail);
  const verifyEmail = useAuth((s) => s.verifyEmail);
  const resend = useAuth((s) => s.resendVerification);

  const queryEmail = searchParams.get("email");
  const storedEmail =
    typeof window !== "undefined"
      ? sessionStorage.getItem("mytaxfiling-pending-verify-email")
      : null;

  const displayEmail = queryEmail || user?.email || pendingEmail || storedEmail || "";

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!displayEmail && !user) {
      navigate("/customer-dashboard/login");
    }
  }, [displayEmail, user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const onResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await resend(displayEmail);
      setCooldown(60);
      notify.success("Code sent", `We sent a new verification code to ${displayEmail}.`);
    } catch (err) {
      notify.error(
        "Couldn't resend",
        err instanceof Error ? err.message : "Please try again in a moment.",
      );
    } finally {
      setResending(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setError("Please enter the verification code sent to your email.");
      return;
    }
    setError(undefined);
    setBusy(true);

    try {
      const ok = await verifyEmail(cleanToken, displayEmail);
      if (!ok) {
        setError("Invalid or expired verification code. Please check and try again.");
        setBusy(false);
        return;
      }
      notify.success("Email verified", "Your account is verified!");
      navigate(user?.onboarded ? "/customer-dashboard/receipts" : "/customer-dashboard/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (user?.emailVerified) {
    return (
      <AuthFocusedLayout headerVariant="simple" showFooter>
        <div className="flex-grow flex items-center justify-center px-4 py-10">
          <div
            className="w-full max-w-[440px] p-8 md:p-10 text-center"
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              border: "1.5px solid rgba(26,51,0,0.10)",
            }}
          >
            <div
              className="mx-auto w-14 h-14 flex items-center justify-center mb-6"
              style={{ backgroundColor: MINT, borderRadius: 12 }}
            >
              <CheckCircle className="w-7 h-7" style={{ color: INK }} />
            </div>

            <p
              className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-50"
              style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
            >
              All Set
            </p>
            <h1
              className="text-2xl font-black uppercase mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
            >
              Email Verified
            </h1>
            <p className="text-sm font-semibold mb-8 opacity-60" style={{ color: INK }}>
              You're ready for the next step — configure your compliance profile and plan.
            </p>

            <Link
              to={
                user.onboarded ? "/customer-dashboard/receipts" : "/customer-dashboard/onboarding"
              }
              className="group w-full h-12 font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: YELLOW,
                color: INK,
                borderRadius: 6,
              }}
            >
              {user.onboarded ? "Go to Dashboard" : "Proceed to Onboarding"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </AuthFocusedLayout>
    );
  }

  return (
    <AuthFocusedLayout headerVariant="simple" showFooter>
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[440px] p-8 md:p-10"
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1.5px solid rgba(26,51,0,0.10)",
          }}
        >
          <div className="flex flex-col gap-2 mb-7">
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
                Verification
              </p>
              <h1
                className="text-2xl font-black uppercase"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Verify Your Email
              </h1>
              <p
                className="text-sm font-semibold mt-1.5 leading-relaxed opacity-60"
                style={{ color: INK }}
              >
                We sent a 6-digit verification OTP to{" "}
                <span className="font-black opacity-100">{displayEmail || "your email"}</span>.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <AuthInput
              label="Verification OTP"
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError(undefined);
              }}
              error={error}
              autoComplete="one-time-code"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onResend}
                disabled={cooldown > 0 || resending}
                className="text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 hover:opacity-60 transition-opacity disabled:opacity-40"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                <RotateCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                {cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : resending
                    ? "Sending OTP…"
                    : "Resend OTP"}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
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
                  Verifying…
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm font-semibold opacity-60" style={{ color: INK }}>
            Wrong email?{" "}
            <Link
              to="/customer-dashboard/signup"
              className="font-black underline hover:no-underline opacity-100"
              style={{ color: INK }}
            >
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </AuthFocusedLayout>
  );
}

export default VerifyPage;
