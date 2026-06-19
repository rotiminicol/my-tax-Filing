import { Link, useNavigate , useSearchParams } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthField from "@/components/auth/Field";
import { useAdminAuth } from "@/store/adminAuth";
import { notify } from "@/components/Toaster";
import loginImg from "@/assets/login.png";
import { z } from "zod";
import { ShieldAlert } from "lucide-react";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [_searchParams] = useSearchParams();
  const redirect = _searchParams.get("redirect");
  const logInAdmin = useAdminAuth((s) => s.logInAdmin);
  const [email, setEmail] = useState("");
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

  const unmetRequirements = passwordRequirements.filter(req => !req.met);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = "Enter a valid email.";
    if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const u = await logInAdmin(email, password);
      
      notify.success("Admin Session Activated", `Welcome to the Admin Console, ${u.fullName}.`);
      const dest = redirect && redirect !== "/admin/login" ? redirect : "/admin";
      navigate(dest);
    } catch (err) {
      notify.error("Authentication failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Admin Console Access"
      title="Administrative Portal"
      subtitle="Authorized personnel only. Please verify your credentials to manage housing allowance compliance operations."
      image={loginImg}
      footer={
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600">Secure Audit Active</span>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mt-2">
            Return to home page
          </Link>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <AuthField 
          label="Administrator Email" 
          type="email" 
          autoComplete="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          error={errors.email} 
        />
        <AuthField
          label="Security Key / Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {password && unmetRequirements.length > 0 && (
          <div className="flex flex-col gap-1 ml-1">
            {unmetRequirements.map((req, index) => (
              <p key={index} className="text-[11px] font-semibold text-gray-500">
                {req.text}
              </p>
            ))}
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-black text-white text-sm font-black hover:opacity-90 transition active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-black/10 cursor-pointer"
        >
          {busy ? "Authenticating Session…" : "Verify Credentials"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default AdminLoginPage;
