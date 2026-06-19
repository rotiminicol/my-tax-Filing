import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Headphones, Send, ArrowRight } from "lucide-react";
import { notify } from "@/components/Toaster";
import AppSelect from "@/components/ui/AppSelect";

const SB = {
  ink: "#1a3300",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

const fieldClass =
  "w-full border rounded-xl p-3.5 text-base outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-[#1a3300]/20 focus:border-[#1a3300]";
const fieldStyle = { backgroundColor: "#f1f1f1", borderColor: "rgba(26,51,0,0.12)", color: "#1a3300" };

export default function ContactPageContent() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [busy, setBusy] = useState(false);

  const headerRef = useScrollAnimation(0.15);
  const formRef = useScrollAnimation(0.1);
  const cardsRef = useScrollAnimation(0.1);
  const bottomRef = useScrollAnimation(0.1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 5) {
      notify.error("Missing details", "Please fill in your name, email, and message.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
      notify.success("Inquiry received", "Our team will respond within one business day.");
    }, 1200);
  };

  return (
    <main className="flex-grow relative overflow-hidden" style={{ backgroundColor: SB.cream }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(${SB.ink} 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
        />
      </div>

      {/* Hero */}
      <section
        ref={headerRef.ref}
        className={`py-12 md:py-20 px-5 md:px-10 max-w-[1280px] mx-auto text-center transition-all duration-1000 ${
          headerRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
          style={{ borderColor: SB.cardBorder, color: SB.ink, backgroundColor: SB.mint }}
        >
          <Headphones className="w-4 h-4" />
          We're listening
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: SB.ink }}>
          We're here to help you navigate your{" "}
          <span className="relative inline-block">
            fiscal journey.
            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke={SB.ink} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
            </svg>
          </span>
        </h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: SB.muted }}>
          Get expert guidance on Nigerian tax regulations. Our team of professionals is ready to assist you
          with compliance, filing, and financial sovereignty.
        </p>
      </section>

      {/* Form + cards */}
      <section className="px-5 md:px-10 max-w-[1280px] mx-auto pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Form */}
          <div
            ref={formRef.ref}
            className={`md:col-span-7 rounded-2xl p-6 md:p-8 border shadow-sm hover:shadow-md transition-all duration-500 ${
              formRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: SB.ink }}>
              <Send className="w-6 h-6" style={{ opacity: 0.5 }} />
              Send us a message
            </h2>
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-sm font-medium" style={{ color: SB.muted }}>Full Name</label>
                  <input
                    type="text"
                    className={fieldClass}
                    style={fieldStyle}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-sm font-medium" style={{ color: SB.muted }}>Email Address</label>
                  <input
                    type="email"
                    className={fieldClass}
                    style={fieldStyle}
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium" style={{ color: SB.muted }}>Subject</label>
                <AppSelect
                  value={form.subject}
                  onValueChange={(subject) => setForm((f) => ({ ...f, subject }))}
                  placeholder="Select subject"
                  options={[
                    { value: "General Inquiry", label: "General Inquiry" },
                    { value: "Technical Support", label: "Technical Support" },
                    { value: "Tax Compliance Help", label: "Tax Compliance Help" },
                    { value: "Billing & Pricing", label: "Billing & Pricing" },
                  ]}
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium" style={{ color: SB.muted }}>Message</label>
                <textarea
                  className={`${fieldClass} resize-none`}
                  style={fieldStyle}
                  placeholder="How can we assist you today?"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full font-bold py-4 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ backgroundColor: SB.ink, color: SB.cream }}
              >
                {busy ? "Sending…" : (<>Submit Inquiry <ArrowRight className="w-5 h-5" /></>)}
              </button>
            </form>
          </div>

          {/* Right column */}
          <div
            ref={cardsRef.ref}
            className={`md:col-span-5 grid grid-cols-1 gap-6 transition-all duration-1000 delay-200 ${
              cardsRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Quick Connect */}
            <div
              className="rounded-2xl p-6 md:p-8 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: SB.ink, color: SB.cream }}
            >
              <Headphones className="absolute top-4 right-4 w-24 h-24 opacity-10" />
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
              <h3 className="text-2xl font-semibold mb-6 relative z-10">Quick Connect</h3>
              <div className="space-y-5 relative z-10">
                {[
                  { icon: Mail, label: "Support Email", value: "help@mytaxfiling.ng" },
                  { icon: Phone, label: "Phone Number", value: "+234 (0) 800 TAX HELP" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-white/15">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
                      <p className="font-bold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Office */}
            <div
              className="rounded-2xl p-6 md:p-8 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: SB.ink }}>
                <MapPin className="w-6 h-6" style={{ opacity: 0.5 }} />
                Physical Office
              </h3>
              <p className="text-sm mb-6" style={{ color: SB.muted }}>
                Federal Capital Territory, Central Business District, Abuja, Nigeria
              </p>
              <div
                className="rounded-xl p-6 flex flex-col items-center justify-center border aspect-[4/3]"
                style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
              >
                <div className="text-center space-y-4">
                  <div
                    className="inline-flex p-4 rounded-full shadow-md"
                    style={{ backgroundColor: SB.mint }}
                  >
                    <MapPin className="w-8 h-8 md:w-10 md:h-10" style={{ color: SB.ink }} />
                  </div>
                  <h4 className="text-lg font-bold" style={{ color: SB.ink }}>Abuja HQ</h4>
                  <p className="text-xs max-w-xs mx-auto" style={{ color: SB.muted }}>
                    Central Business District, Abuja
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-semibold hover:shadow-md transition-all"
                    style={{ backgroundColor: SB.white, color: SB.ink }}
                    onClick={() => notify.info("Map", "Opening map in your browser…")}
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        ref={bottomRef.ref}
        className={`py-12 md:py-16 px-5 md:px-10 transition-all duration-1000 ${
          bottomRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ backgroundColor: SB.teal }}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: SB.ink }}>
              Looking for immediate answers?
            </h2>
            <p className="text-sm opacity-80" style={{ color: SB.ink }}>
              Check our comprehensive help center for guides on VAT, Personal Income Tax, and corporate filings.
            </p>
          </div>
          <Link
            to="/news"
            className="border-2 px-8 py-3 rounded-xl font-bold transition-all hover:bg-[#1a3300]/10 active:scale-95 inline-flex items-center gap-2"
            style={{ borderColor: SB.ink, color: SB.ink }}
          >
            Visit Tax Hub
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
