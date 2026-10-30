import { Link } from "react-router-dom";
import { ArrowRight, Shield, Bell, CheckCircle } from "lucide-react";
import AuthFocusedLayout from "@/components/auth/AuthFocusedLayout";

const INK = "#18623f";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const MINT = "#d5f5c2";

function ResetSuccessPage() {
  return (
    <AuthFocusedLayout headerVariant="simple">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px] flex flex-col gap-5">
          {/* Main card */}
          <div
            className="p-8 md:p-10 text-center"
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              border: "1.5px solid rgba(26,51,0,0.10)",
            }}
          >
            <div
              className="mx-auto w-16 h-16 flex items-center justify-center mb-6"
              style={{ backgroundColor: TEAL, borderRadius: 12 }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: INK }} />
            </div>

            <p
              className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-50"
              style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
            >
              Done
            </p>
            <h1
              className="text-2xl font-black uppercase mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
            >
              Password Reset
              <br />
              Successful
            </h1>
            <p className="text-sm font-semibold mb-8 leading-relaxed opacity-60" style={{ color: INK }}>
              Your security credentials have been updated. You can now sign in with your new password.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-[10px] font-black uppercase tracking-[0.15em]"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: MINT,
                color: INK,
                borderRadius: 6,
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              Account Secure
            </div>

            <Link
              to="/customer-dashboard/login"
              className="group w-full h-12 font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: YELLOW,
                color: INK,
                borderRadius: 6,
              }}
            >
              Log In to Your Account
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="mt-6 pt-5" style={{ borderTop: "1.5px solid rgba(26,51,0,0.08)" }}>
              <p className="text-xs font-semibold opacity-50" style={{ color: INK }}>
                Didn't perform this action?{" "}
                <Link to="/contact" className="font-black underline hover:no-underline opacity-100" style={{ color: INK }}>
                  Secure your account
                </Link>
              </p>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                bg: TEAL,
                icon: <Shield className="w-4 h-4" style={{ color: INK }} />,
                title: "Compliance First",
                sub: "Encrypted with 256-bit military-grade security.",
              },
              {
                bg: MINT,
                icon: <Bell className="w-4 h-4" style={{ color: INK }} />,
                title: "Confirmation Sent",
                sub: "Check your email for a reset confirmation receipt.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4"
                style={{
                  backgroundColor: item.bg,
                  borderRadius: 12,
                  border: "1.5px solid rgba(26,51,0,0.10)",
                }}
              >
                <div className="mb-2">{item.icon}</div>
                <p className="text-xs font-black" style={{ color: INK }}>{item.title}</p>
                <p className="text-[11px] font-semibold mt-0.5 opacity-60" style={{ color: INK }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthFocusedLayout>
  );
}

export default ResetSuccessPage;
