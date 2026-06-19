import { useEffect, useState } from "react";

const KEY = "rr-cookie-consent-v1";

type Choice = "accepted" | "declined" | "customized";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!stored) {
      const t = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice, at: new Date().toISOString() }));
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500
        bottom-0 inset-x-0"
    >
      {/* Mobile View */}
      <div className="md:hidden p-4">
        <div
          className="rounded-xl border-2 p-6 flex flex-col gap-5 shadow-[0_-4px_24px_rgba(26,51,0,0.10)]"
          style={{ backgroundColor: "#fcfaf5", borderColor: "#1a3300" }}
        >
          <p className="text-[13px] leading-[1.65] font-sans" style={{ color: "#1a3300" }}>
            We use tracking technologies for the correct functioning of our website. If you click "accept" you are also permitting us to use targeted advertising technologies, if you click "decline" we will not use targeted advertising technologies. If you would like to configure other preferences, click "customize settings."
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => decide("customized")}
              className="w-full py-3 px-4 rounded-md border-2 text-sm font-bold transition-all hover:bg-[#1a3300]/5 active:scale-[0.98]"
              style={{ borderColor: "#1a3300", color: "#1a3300", backgroundColor: "transparent" }}
            >
              Customize Settings
            </button>
            <div className="flex gap-2.5">
              <button
                onClick={() => decide("declined")}
                className="flex-1 py-3 px-4 rounded-md text-sm font-bold transition-all hover:opacity-85 active:scale-[0.98]"
                style={{ backgroundColor: "#1a3300", color: "#fcfaf5" }}
              >
                Decline
              </button>
              <button
                onClick={() => decide("accepted")}
                className="flex-1 py-3 px-4 rounded-md text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#ffe95c", color: "#1a3300" }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div
        className="hidden md:block border-t-2 shadow-[0_-4px_20px_rgba(26,51,0,0.09)]"
        style={{ backgroundColor: "#fcfaf5", borderColor: "#1a3300" }}
      >
        <div className="flex items-center justify-between gap-10 w-full px-10 py-7">
          <p
            className="text-[14px] leading-[1.6] flex-1 font-sans"
            style={{ color: "#1a3300" }}
          >
            We use tracking technologies for the correct functioning of our website. If you click "accept" you are also permitting us to use targeted advertising technologies, if you click "decline" we will not use targeted advertising technologies. If you would like to configure other preferences, click "customize settings."
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => decide("customized")}
              className="px-5 py-2.5 rounded-md border-2 text-[13px] font-bold transition-all hover:bg-[#1a3300]/5 active:scale-[0.98] whitespace-nowrap"
              style={{ borderColor: "#1a3300", color: "#1a3300", backgroundColor: "transparent" }}
            >
              Customize Settings
            </button>
            <button
              onClick={() => decide("declined")}
              className="px-8 py-2.5 rounded-md text-[13px] font-bold transition-all hover:opacity-85 active:scale-[0.98] whitespace-nowrap"
              style={{ backgroundColor: "#1a3300", color: "#fcfaf5" }}
            >
              Decline
            </button>
            <button
              onClick={() => decide("accepted")}
              className="px-8 py-2.5 rounded-md text-[13px] font-bold transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap"
              style={{ backgroundColor: "#ffe95c", color: "#1a3300" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
