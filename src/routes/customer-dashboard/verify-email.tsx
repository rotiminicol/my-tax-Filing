import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Mail, Copy, ArrowRight } from "lucide-react";
import AuthFocusedLayout from "@/components/auth/AuthFocusedLayout";
import AuthInput from "@/components/auth/AuthInput";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";

const INK = "#1a3300";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const MINT = "#d5f5c2";

function VerifyPage() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const verifyEmail = useAuth((s) => s.verifyEmail);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) navigate("/customer-dashboard/login");
  }, [user, navigate]);

  if (!user) return null;

  const demoToken = user.id.slice(0, 6);

  const copyCode = () => {
    navigator.clipboard.writeText(demoToken);
    notify.success("Copied", "Verification code copied to clipboard");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (!verifyEmail(token.trim())) {
      setError("Invalid verification code.");
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  if (user.emailVerified) {
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
              You're ready for the next step — choose your account type and plan.
            </p>

            <Link
              to="/customer-dashboard/onboarding"
              className="group w-full h-12 font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: YELLOW,
                color: INK,
                borderRadius: 6,
              }}
            >
              Proceed to Onboarding
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
                Step 1 of 2
              </p>
              <h1
                className="text-2xl font-black uppercase"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Verify Your Email
              </h1>
              <p className="text-sm font-semibold mt-1.5 leading-relaxed opacity-60" style={{ color: INK }}>
                We sent a 6-character code to{" "}
                <span className="font-black opacity-100">{user.email}</span>.
              </p>
            </div>
          </div>

          {/* Demo code strip */}
          <div
            className="flex items-center justify-between px-4 py-3 mb-6"
            style={{
              backgroundColor: "rgba(26,51,0,0.04)",
              borderRadius: 8,
              border: "1.5px solid rgba(26,51,0,0.10)",
            }}
          >
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.15em] opacity-50 mb-1"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                Demo code
              </p>
              <p
                className="font-mono text-lg font-black tracking-[0.3em]"
                style={{ color: INK }}
              >
                {demoToken}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="p-2 rounded hover:opacity-60 transition-opacity"
              style={{ color: INK }}
              title="Copy code"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <AuthInput
              label="Verification Code"
              placeholder="Enter 6-character code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              error={error}
              autoComplete="one-time-code"
            />

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
