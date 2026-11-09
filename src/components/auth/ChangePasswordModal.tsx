import { useState, useMemo } from "react";
import { Lock, X, CheckCircle, Circle, Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";
import AuthInput from "./AuthInput";

const INK = "#18623f";
const YELLOW = "#ffe95c";
const BAR_COLORS = ["#ef4444", "#f97316", "#84cc16", INK];

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

function strengthScore(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (pwd.length > 12 && s >= 3) return 4;
  return s;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const changePassword = useAuth((s) => s.changePassword);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

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

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};

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
      await changePassword(pwd);
      notify.success("Password Updated", "Your password has been changed successfully.");
      setPwd("");
      setConfirm("");
      onClose();
    } catch (err) {
      notify.error("Error", err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border"
        style={{ borderColor: "rgba(26,51,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#d5f5c2" }}
            >
              <Lock className="w-5 h-5" style={{ color: INK }} />
            </div>
            <div>
              <h3
                className="text-lg font-black uppercase"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
              >
                Change Password
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Enter and confirm your new secure password
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4 mt-5">
          <div>
            <AuthInput
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                if (errs.pwd) setErrs({ ...errs, pwd: "" });
              }}
              error={errs.pwd}
              trailingIcon="password"
              autoComplete="new-password"
            />

            {pwd && unmetRequirements.length > 0 && (
              <div className="flex flex-col gap-0.5 mt-2">
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

            {/* Strength meter */}
            <div className="mt-2.5 flex flex-col gap-1.5">
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
            </div>
          </div>

          <div>
            <AuthInput
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (errs.confirm) setErrs({ ...errs, confirm: "" });
              }}
              error={errs.confirm}
              trailingIcon="password"
              autoComplete="new-password"
            />
            {matchError && (
              <p className="text-[11px] font-semibold text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              {busy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
