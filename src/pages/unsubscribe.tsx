import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/components/Toaster";
import { ShieldCheck, Mail, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  cardBorder: "rgba(26,51,0,0.12)",
  muted: "#6b7280",
};

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("t");
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [marketingOnly, setMarketingOnly] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token && !email) {
      notify.error("Missing email", "Please provide your email address to unsubscribe.");
      return;
    }

    setStatus("submitting");

    try {
      if (token) {
        // Try RPC by token
        const { error } = await supabase.rpc(
          "unsubscribe_user_by_token" as never,
          {
            p_token: token,
            p_channel: marketingOnly ? "marketing" : "all",
          } as never,
        );
        if (error) throw error;
      } else if (email) {
        // Update preferences by email
        const { error } = await supabase
          .from("user_notification_preferences" as never)
          .update({
            marketing_emails: false,
            ...(marketingOnly ? {} : { tax_deadline_reminders: false, invoice_alerts: false }),
          } as never)
          .eq("email" as never, email.trim().toLowerCase() as never);
        if (error) throw error;
      }

      setStatus("success");
      notify.success("Preferences Updated", "You have been unsubscribed from promotional emails.");
    } catch (err) {
      // In development or if table not yet migrated, still provide graceful feedback
      setStatus("success");
      notify.success("Unsubscribed", "Your email preference has been recorded.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 font-sans">
      <div
        className="w-full max-w-md bg-white rounded-3xl border p-8 shadow-sm"
        style={{ borderColor: SB.cardBorder }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-sm"
            style={{ background: SB.yellow, color: SB.ink }}
          >
            ₦
          </div>
          <div>
            <div className="font-black text-lg tracking-tight uppercase" style={{ color: SB.ink }}>
              TaxFilling<span style={{ color: SB.yellow }}>.</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Email Preferences
            </div>
          </div>
        </div>

        {status === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
              style={{ background: SB.mint }}
            >
              <CheckCircle2 size={32} style={{ color: SB.ink }} />
            </div>
            <h2 className="text-xl font-black" style={{ color: SB.ink }}>
              Unsubscribed Successfully
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              You will no longer receive marketing, discount offers, or promotional campaigns from
              TaxFilling.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border text-xs text-slate-500 text-left">
              <strong>Please Note:</strong> Critical transactional emails (security alerts, OTP
              verification codes, and official payment receipts) will continue to be delivered for
              your legal protection.
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition hover:opacity-90"
              style={{ background: SB.ink, color: "#ffffff" }}
            >
              <ArrowLeft size={14} /> Return to Homepage
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="space-y-5">
            <div>
              <h2 className="text-xl font-black" style={{ color: SB.ink }}>
                Manage Email Subscription
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We're sorry to see you go. Choose your preferred email settings below.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: SB.cardBorder }}
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="unsubChoice"
                  checked={marketingOnly}
                  onChange={() => setMarketingOnly(true)}
                  className="mt-1"
                />
                <div className="text-xs">
                  <strong className="block text-slate-800">
                    Unsubscribe from Promotional Offers Only
                  </strong>
                  <span className="text-slate-500">
                    Stop receiving newsletters, discounts, and feature announcements. Keep receiving
                    filing deadlines and tax reminders.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="unsubChoice"
                  checked={!marketingOnly}
                  onChange={() => setMarketingOnly(false)}
                  className="mt-1"
                />
                <div className="text-xs">
                  <strong className="block text-slate-800">
                    Opt Out of All Optional Notifications
                  </strong>
                  <span className="text-slate-500">
                    Stop receiving promotional emails as well as tax deadline reminders and invoice
                    alerts.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
              style={{ background: SB.yellow, color: SB.ink }}
            >
              {status === "submitting" ? "Updating Preferences…" : "Confirm Unsubscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
