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
  const [clientType, setClientType] = useState<"individual" | "business">("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const headerRef = useScrollAnimation(0.15);
  const formRef = useScrollAnimation(0.1);
  const cardsRef = useScrollAnimation(0.1);
  const bottomRef = useScrollAnimation(0.1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      notify.error("Missing details", "Please fill in your name, email, and message.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
      notify.success("Inquiry received", "Thank you. We have received your message and will be in touch shortly.");
    }, 1000);
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
          style={{ borderColor: SB.cardBorder, color: SB.ink, backgroundColor: SB.yellow }}
        >
          <Headphones className="w-4 h-4" />
          NIGERIA TAX SPECIALISTS
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: SB.ink, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Contact us
        </h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: SB.muted }}>
          Tell us whether you are an individual or a business and what you need. A tax specialist will get back to you within one working day.
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
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                  style={{ backgroundColor: SB.yellow, border: `2px solid ${SB.ink}` }}
                >
                  <Send className="w-8 h-8" style={{ color: SB.ink }} />
                </div>
                <h3 className="text-2xl font-extrabold" style={{ color: SB.ink, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Thank you!
                </h3>
                <p className="text-base max-w-md mx-auto" style={{ color: SB.muted }}>
                  Thank you. We have received your message and will be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setMessage("");
                  }}
                  className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold border transition-colors hover:bg-stone-50"
                  style={{ borderColor: SB.ink, color: SB.ink }}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: SB.ink }}>
                  <Send className="w-6 h-6" style={{ opacity: 0.5 }} />
                  Send us a message
                </h2>
                <form className="space-y-4" onSubmit={submit}>
                  {/* Segmented type selector */}
                  <div>
                    <label className="text-sm font-medium block mb-2" style={{ color: SB.muted }}>
                      I am:
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-1 rounded-xl border" style={{ borderColor: SB.cardBorder, backgroundColor: "#f9f8f5" }}>
                      <button
                        type="button"
                        onClick={() => setClientType("individual")}
                        className={`py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                          clientType === "individual" ? "shadow-sm" : "opacity-60"
                        }`}
                        style={{
                          backgroundColor: clientType === "individual" ? SB.ink : "transparent",
                          color: clientType === "individual" ? SB.cream : SB.ink,
                        }}
                      >
                        An individual or tenant
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType("business")}
                        className={`py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                          clientType === "business" ? "shadow-sm" : "opacity-60"
                        }`}
                        style={{
                          backgroundColor: clientType === "business" ? SB.ink : "transparent",
                          color: clientType === "business" ? SB.cream : SB.ink,
                        }}
                      >
                        A business
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-sm font-medium" style={{ color: SB.muted }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        className={fieldClass}
                        style={fieldStyle}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-sm font-medium" style={{ color: SB.muted }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        className={fieldClass}
                        style={fieldStyle}
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-sm font-medium" style={{ color: SB.muted }}>Phone Number</label>
                    <input
                      type="tel"
                      className={fieldClass}
                      style={fieldStyle}
                      placeholder="+234 (0) 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-sm font-medium" style={{ color: SB.muted }}>How can we help? *</label>
                    <textarea
                      required
                      className={`${fieldClass} resize-none`}
                      style={fieldStyle}
                      placeholder={
                        clientType === "individual"
                          ? "How can we assist you with rent relief or personal tax filing?"
                          : "Tell us about your business turnover, accounting system, or e-invoicing needs..."
                      }
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full font-bold py-4 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{ backgroundColor: SB.ink, color: SB.cream }}
                  >
                    {busy ? "Sending…" : (<>Send message <ArrowRight className="w-5 h-5" /></>)}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right column */}
          <div
            ref={cardsRef.ref}
            className={`md:col-span-5 grid grid-cols-1 gap-6 transition-all duration-1000 delay-200 ${
              cardsRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Direct Details */}
            <div
              className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
              style={{ backgroundColor: SB.ink, color: SB.cream }}
            >
              <h3 className="text-2xl font-bold mb-6 relative z-10">Direct Contact</h3>
              <div className="space-y-5 relative z-10">
                {[
                  { icon: Mail, label: "Email", value: "hello@taxfiling.com.ng" },
                  { icon: Phone, label: "Phone", value: "+234 (0) 1 234 5678" },
                  { icon: MapPin, label: "Office", value: "Victoria Island, Lagos, Nigeria" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-white/15">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
                      <p className="font-bold text-sm sm:text-base">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours & Response SLA */}
            <div
              className="rounded-2xl p-6 md:p-8 border shadow-sm"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: SB.ink }}>
                <Headphones className="w-5 h-5" style={{ opacity: 0.6 }} />
                Dedicated Advisory
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: SB.muted }}>
                Our team responds to all inquiries within one working day.
              </p>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: "#f9f8f5", borderColor: SB.cardBorder }}>
                <p className="text-xs uppercase font-mono font-bold tracking-wider opacity-60 mb-1">
                  Operating Hours
                </p>
                <p className="text-sm font-bold" style={{ color: SB.ink }}>
                  Monday – Friday: 8:00 AM – 5:00 PM WAT
                </p>
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
