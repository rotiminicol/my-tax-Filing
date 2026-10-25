import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Building2,
  User,
} from "lucide-react";
import { notify } from "@/components/Toaster";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";

function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function LandingContactSection() {
  const rm = Boolean(useReducedMotion());

  const [clientType, setClientType] = useState<"individual" | "business">("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      notify.error("Missing information", "Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      notify.success("Message sent", "Thank you. We have received your message and will be in touch shortly.");
    }, 800);
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      <div
        className="h-px w-full absolute top-0"
        style={{ backgroundColor: PENCIL, opacity: 0.35 }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Details & Intro */}
          <motion.div {...rev(rm, 20, 0)} className="lg:col-span-5 space-y-6">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: YELLOW,
                color: INK,
                fontFamily: "'Roboto Mono', monospace",
                letterSpacing: "0.08em",
              }}
            >
              GET IN TOUCH
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{
                fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                color: INK,
                lineHeight: 1.1,
              }}
            >
              Contact us
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{
                color: INK,
                opacity: 0.72,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Tell us whether you are an individual or a business and what you need.
              A tax specialist will get back to you within one working day.
            </p>

            <div className="pt-4 space-y-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#f5f2ec", border: `1px solid ${PENCIL}` }}
                >
                  <Mail className="w-5 h-5" style={{ color: INK }} />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold uppercase opacity-60" style={{ color: INK }}>
                    Email
                  </p>
                  <a
                    href="mailto:hello@taxfiling.com.ng"
                    className="font-bold text-base hover:underline"
                    style={{ color: INK }}
                  >
                    hello@taxfiling.com.ng
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#f5f2ec", border: `1px solid ${PENCIL}` }}
                >
                  <Phone className="w-5 h-5" style={{ color: INK }} />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold uppercase opacity-60" style={{ color: INK }}>
                    Phone
                  </p>
                  <a
                    href="tel:+23412345678"
                    className="font-bold text-base hover:underline"
                    style={{ color: INK }}
                  >
                    +234 (0) 1 234 5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#f5f2ec", border: `1px solid ${PENCIL}` }}
                >
                  <MapPin className="w-5 h-5" style={{ color: INK }} />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold uppercase opacity-60" style={{ color: INK }}>
                    Office
                  </p>
                  <p className="font-bold text-base" style={{ color: INK }}>
                    Victoria Island, Lagos, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#f5f2ec", border: `1px solid ${PENCIL}` }}
                >
                  <Clock className="w-5 h-5" style={{ color: INK }} />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold uppercase opacity-60" style={{ color: INK }}>
                    Hours
                  </p>
                  <p className="font-bold text-base" style={{ color: INK }}>
                    Monday – Friday: 8:00 AM – 5:00 PM WAT
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            {...rev(rm, 24, 0.1)}
            className="lg:col-span-7 rounded-2xl p-7 sm:p-10"
            style={{
              backgroundColor: "#f5f2ec",
              border: `1.5px solid ${INK}`,
              boxShadow: "5px 5px 0px 0px #1a3300",
            }}
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                  style={{ backgroundColor: YELLOW, border: `2px solid ${INK}` }}
                >
                  <CheckCircle className="w-8 h-8 text-emerald-800" />
                </div>
                <h3
                  className="text-2xl font-extrabold"
                  style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Thank you!
                </h3>
                <p className="text-base max-w-md mx-auto" style={{ color: INK, opacity: 0.8 }}>
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
                  className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold border transition-colors hover:bg-white"
                  style={{ borderColor: INK, color: INK }}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Segmented Control: I am */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: INK }}>
                    I am:
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl border border-[#1a3300]/20 bg-white">
                    <button
                      type="button"
                      onClick={() => setClientType("individual")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                        clientType === "individual"
                          ? "shadow-sm"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: clientType === "individual" ? INK : "transparent",
                        color: clientType === "individual" ? CREAM : INK,
                      }}
                    >
                      <User className="w-4 h-4" />
                      An individual or tenant
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientType("business")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                        clientType === "business"
                          ? "shadow-sm"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: clientType === "business" ? INK : "transparent",
                        color: clientType === "business" ? CREAM : INK,
                      }}
                    >
                      <Building2 className="w-4 h-4" />
                      A business
                    </button>
                  </div>
                </div>

                {/* Full name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: INK }}>
                      Full name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Babatunde Fashola"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:bg-white"
                      style={{
                        backgroundColor: "white",
                        borderColor: PENCIL,
                        color: INK,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: INK }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. b.fashola@company.ng"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:bg-white"
                      style={{
                        backgroundColor: "white",
                        borderColor: PENCIL,
                        color: INK,
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: INK }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 803 000 0000"
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:bg-white"
                    style={{
                      backgroundColor: "white",
                      borderColor: PENCIL,
                      color: INK,
                    }}
                  />
                </div>

                {/* How can we help? */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: INK }}>
                    How can we help? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      clientType === "individual"
                        ? "Tell us about your rent relief question, tenancy agreement, or personal tax situation..."
                        : "Tell us about your e-invoicing turnover band, current accounting software, or timeline..."
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:bg-white resize-none"
                    style={{
                      backgroundColor: "white",
                      borderColor: PENCIL,
                      color: INK,
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: INK,
                    color: CREAM,
                    boxShadow: "0 2px 8px rgba(26,51,0,0.14)",
                  }}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send message
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
