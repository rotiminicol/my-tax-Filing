import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Headphones,
  Send,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { notify } from "@/components/Toaster";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/auth";
import {
  sendSupportTicketConfirmation,
  sendSupportTeamInquiryAlert,
} from "@/lib/email/emailClient";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

const TOPIC_CATEGORIES = [
  { id: "personal_tax", label: "Personal Income Tax & Reliefs" },
  { id: "rent_relief", label: "Rent Relief & Tenancy Claims" },
  { id: "business_tax", label: "Corporate Tax & Filing Compliance" },
  { id: "einvoicing", label: "E-Invoicing & Systems Integration" },
  { id: "billing", label: "Account, Plans & Subscriptions" },
  { id: "general", label: "General Legal / Tax Inquiry" },
];

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

const fieldClass =
  "w-full border rounded-xl p-3.5 text-base outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f]";
const fieldStyle = {
  backgroundColor: "#f9f8f5",
  borderColor: "rgba(26,51,0,0.12)",
  color: "#18623f",
};

export default function ContactPageContent() {
  const user = useAuth((s) => s.user);

  const [clientType, setClientType] = useState<"individual" | "business">("individual");
  const [category, setCategory] = useState("personal_tax");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignedTicketId, setAssignedTicketId] = useState("");
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      if (user.fullName && !name) setName(user.fullName);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.accountType === "organization") {
        setClientType("business");
        setCategory("business_tax");
      }
    }
  }, [user]);

  const headerRef = useScrollAnimation(0.15);
  const formRef = useScrollAnimation(0.1);
  const cardsRef = useScrollAnimation(0.1);
  const bottomRef = useScrollAnimation(0.1);

  const handleCopyTicket = async () => {
    if (!assignedTicketId) return;
    try {
      await navigator.clipboard.writeText(assignedTicketId);
      setCopiedTicket(true);
      notify.success("Copied to clipboard", `Ticket #${assignedTicketId} copied.`);
      setTimeout(() => setCopiedTicket(false), 2500);
    } catch {
      notify.error("Copy failed", "Please select and copy the ticket reference manually.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanSubject =
      subject.trim() ||
      TOPIC_CATEGORIES.find((t) => t.id === category)?.label ||
      "TaxFilling Inquiry";
    const cleanMessage = message.trim();

    if (!cleanName || cleanName.length < 2) {
      notify.error("Full Name Required", "Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      notify.error("Valid Email Required", "Please provide a valid email address.");
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      notify.error(
        "Message Too Short",
        "Please provide a little more detail in your inquiry (minimum 10 characters).",
      );
      return;
    }

    setBusy(true);

    // Fallback ticket format: TK-YYYYMMDD-XXXX
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    let finalTicketId = `TK-${todayStr}-${randomHex}`;

    try {
      // 1. Attempt insertion via RPC function
      const { data: rpcData, error: rpcError } = await (supabase.rpc as any)(
        "submit_contact_message",
        {
          p_name: cleanName,
          p_email: cleanEmail,
          p_phone: cleanPhone || null,
          p_client_type: clientType,
          p_category: category,
          p_subject: cleanSubject,
          p_message: cleanMessage,
          p_user_id: user?.id || null,
          p_source: "contact_page",
          p_metadata: {
            browserAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        },
      );

      if (!rpcError && rpcData && (rpcData as any).ticket_id) {
        finalTicketId = (rpcData as any).ticket_id;
      } else {
        // Fallback: direct table insert
        const { data: tableData, error: tableError } = await supabase
          .from("contact_messages")
          .insert({
            ticket_id: finalTicketId,
            user_id: user?.id || null,
            client_type: clientType,
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone || null,
            category,
            subject: cleanSubject,
            message: cleanMessage,
            source: "contact_page",
            status: "new",
          })
          .select("ticket_id")
          .maybeSingle();

        if (tableError) {
          console.warn("Contact table insert fallback notice:", tableError.message);
        } else if (tableData?.ticket_id) {
          finalTicketId = tableData.ticket_id;
        }
      }

      setAssignedTicketId(finalTicketId);

      // 2. Dispatch Confirmation Email to Customer
      sendSupportTicketConfirmation({
        email: cleanEmail,
        fullName: cleanName,
        ticketId: finalTicketId,
        subject: cleanSubject,
        message: cleanMessage,
      }).catch((emailErr) => {
        console.warn("User confirmation email notice:", emailErr);
      });

      // 3. Dispatch Alert Email to Official Support Team
      sendSupportTeamInquiryAlert({
        ticketId: finalTicketId,
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        clientType,
        category: TOPIC_CATEGORIES.find((c) => c.id === category)?.label || category,
        subject: cleanSubject,
        message: cleanMessage,
        submittedAt: new Date().toUTCString(),
      }).catch((teamEmailErr) => {
        console.warn("Staff notification email notice:", teamEmailErr);
      });

      setSubmitted(true);
      notify.success(
        "Inquiry Received!",
        `Ticket #${finalTicketId} created. A confirmation email has been dispatched to ${cleanEmail}.`,
      );
    } catch (err) {
      console.error("Submission failed:", err);
      // Still show success if ticket was generated
      setAssignedTicketId(finalTicketId);
      setSubmitted(true);
      notify.success(
        "Inquiry Logged",
        `Your inquiry reference is #${finalTicketId}. Our team will contact you shortly.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setAssignedTicketId("");
    setSubject("");
    setMessage("");
    if (!user) {
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  return (
    <main className="flex-grow relative overflow-hidden" style={{ backgroundColor: SB.cream }}>
      {/* Dot grid subtle background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${SB.ink} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-4 border"
          style={{
            backgroundColor: SB.mint,
            color: SB.ink,
            borderColor: "rgba(24,98,63,0.2)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Direct Compliance Advisory & Support
        </div>

        <h1
          className="text-4xl md:text-6xl font-extrabold mb-4"
          style={{ color: SB.ink, fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Contact our specialists
        </h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: SB.muted }}>
          Whether you are an individual tenant claiming rent relief or a business setting up
          e-invoicing compliance, our qualified tax practitioners respond within one working day.
        </p>
      </section>

      {/* Form + Cards */}
      <section className="px-5 md:px-10 max-w-[1280px] mx-auto pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Main Form Box */}
          <div
            ref={formRef.ref}
            className={`md:col-span-7 rounded-2xl p-6 md:p-8 border shadow-sm hover:shadow-md transition-all duration-500 ${
              formRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
          >
            {submitted ? (
              <div className="py-8 text-center space-y-6 animate-fadeIn">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-md"
                  style={{ backgroundColor: SB.yellow, border: `2px solid ${SB.ink}` }}
                >
                  <CheckCircle2 className="w-8 h-8" style={{ color: SB.ink }} />
                </div>

                <div>
                  <h3
                    className="text-2xl md:text-3xl font-extrabold mb-2"
                    style={{ color: SB.ink, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: SB.muted }}>
                    Thank you, <strong>{name}</strong>. Your inquiry has been routed to our
                    dedicated tax compliance desk.
                  </p>
                </div>

                {/* Ticket Reference Badge Card */}
                <div
                  className="p-5 rounded-2xl border text-left max-w-md mx-auto space-y-3 shadow-inner"
                  style={{ backgroundColor: "#f9f8f5", borderColor: SB.cardBorder }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider opacity-60">
                      Ticket Reference Code
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTicket}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all active:scale-95"
                      style={{
                        backgroundColor: copiedTicket ? SB.mint : SB.white,
                        borderColor: SB.cardBorder,
                        color: SB.ink,
                      }}
                    >
                      {copiedTicket ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>

                  <p
                    className="text-2xl font-black font-mono tracking-tight"
                    style={{ color: SB.ink }}
                  >
                    #{assignedTicketId}
                  </p>

                  <div
                    className="pt-2 border-t text-xs space-y-1.5"
                    style={{ borderColor: SB.cardBorder }}
                  >
                    <div className="flex justify-between">
                      <span style={{ color: SB.muted }}>Confirmation email:</span>
                      <span className="font-semibold" style={{ color: SB.ink }}>
                        {email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: SB.muted }}>Response SLA:</span>
                      <span className="font-semibold text-emerald-700">Within 1 business day</span>
                    </div>
                  </div>
                </div>

                {/* Reassurance note */}
                <div className="text-xs flex items-center justify-center gap-2 max-w-md mx-auto text-gray-500">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Our team operates Monday – Friday: 8:00 AM – 5:00 PM WAT</span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold border transition-colors hover:bg-stone-50"
                    style={{ borderColor: SB.ink, color: SB.ink }}
                  >
                    Submit another inquiry
                  </button>

                  <Link
                    to="/news"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold shadow transition-all hover:opacity-90 inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: SB.ink, color: SB.cream }}
                  >
                    Explore Tax Knowledge Hub <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold flex items-center gap-2"
                    style={{ color: SB.ink }}
                  >
                    <Send className="w-6 h-6" style={{ opacity: 0.6 }} />
                    Send us a message
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    SLA: 1 Working Day
                  </span>
                </div>

                <form className="space-y-4" onSubmit={submit}>
                  {/* Segmented type selector: Individual vs Business */}
                  <div>
                    <label
                      className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                      style={{ color: SB.muted }}
                    >
                      I am contacting as:
                    </label>
                    <div
                      className="grid grid-cols-2 gap-3 p-1 rounded-xl border"
                      style={{ borderColor: SB.cardBorder, backgroundColor: "#f9f8f5" }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setClientType("individual");
                          if (category === "business_tax" || category === "einvoicing") {
                            setCategory("personal_tax");
                          }
                        }}
                        className={`py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                          clientType === "individual" ? "shadow-sm" : "opacity-60"
                        }`}
                        style={{
                          backgroundColor: clientType === "individual" ? SB.ink : "transparent",
                          color: clientType === "individual" ? SB.cream : SB.ink,
                        }}
                      >
                        Individual / Tenant
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setClientType("business");
                          if (category === "personal_tax" || category === "rent_relief") {
                            setCategory("business_tax");
                          }
                        }}
                        className={`py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                          clientType === "business" ? "shadow-sm" : "opacity-60"
                        }`}
                        style={{
                          backgroundColor: clientType === "business" ? SB.ink : "transparent",
                          color: clientType === "business" ? SB.cream : SB.ink,
                        }}
                      >
                        Business / Enterprise
                      </button>
                    </div>
                  </div>

                  {/* Topic / Category dropdown */}
                  <div className="space-y-1 text-left">
                    <label
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: SB.muted }}
                    >
                      Inquiry Topic *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={fieldClass}
                      style={fieldStyle}
                    >
                      {TOPIC_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Email inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: SB.muted }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className={fieldClass}
                        style={fieldStyle}
                        placeholder="e.g. Adebayo Olawale"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: SB.muted }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className={fieldClass}
                        style={fieldStyle}
                        placeholder="adebayo@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone & Subject row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: SB.muted }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={fieldClass}
                        style={fieldStyle}
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: SB.muted }}
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        className={fieldClass}
                        style={fieldStyle}
                        placeholder="Brief summary of your inquiry"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: SB.muted }}
                      >
                        How can we help? *
                      </label>
                      <span className="text-xs text-gray-400">
                        {message.length} characters (min 10)
                      </span>
                    </div>
                    <textarea
                      required
                      className={`${fieldClass} resize-none`}
                      style={fieldStyle}
                      placeholder={
                        clientType === "individual"
                          ? "Please describe your question regarding rent relief claims, landlord receipts, or personal income tax returns..."
                          : "Describe your business requirements, annual turnover bracket, accounting software, or e-invoicing questions..."
                      }
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full font-bold py-4 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{ backgroundColor: SB.ink, color: SB.cream }}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting Inquiry…
                      </>
                    ) : (
                      <>
                        Send Inquiry & Create Ticket <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500 pt-1">
                    Your inquiry is protected by enterprise-grade encryption and handled in
                    accordance with NDPR guidelines.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Right Column: Contact Details & Service Guarantee */}
          <div
            ref={cardsRef.ref}
            className={`md:col-span-5 grid grid-cols-1 gap-6 transition-all duration-1000 delay-200 ${
              cardsRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Direct Details Card */}
            <div
              className="rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm"
              style={{ backgroundColor: SB.ink, color: SB.cream }}
            >
              <h3 className="text-2xl font-bold mb-6 relative z-10">Direct Contact</h3>
              <div className="space-y-5 relative z-10">
                {[
                  {
                    icon: Mail,
                    label: "Email Support",
                    value: "hello@taxfiling.com.ng",
                    href: "mailto:hello@taxfiling.com.ng",
                  },
                  {
                    icon: Phone,
                    label: "Advisory Hotline",
                    value: "+234 (0) 1 234 5678",
                    href: "tel:+23412345678",
                  },
                  {
                    icon: MapPin,
                    label: "Lagos Headquarters",
                    value: "Victoria Island, Lagos, Nigeria",
                    href: undefined,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-white/15">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="font-bold text-sm sm:text-base hover:underline text-white"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-bold text-sm sm:text-base">{value}</p>
                      )}
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
              <h3
                className="text-xl font-bold mb-3 flex items-center gap-2"
                style={{ color: SB.ink }}
              >
                <Headphones className="w-5 h-5" style={{ opacity: 0.7 }} />
                Advisory Standards
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: SB.muted }}>
                Every inquiry is assigned a unique reference ticket and reviewed by an accredited
                Nigerian tax practitioner or systems engineer.
              </p>
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{ backgroundColor: "#f9f8f5", borderColor: SB.cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider opacity-60">
                    Business Hours
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-sm font-bold" style={{ color: SB.ink }}>
                  Monday – Friday: 8:00 AM – 5:00 PM WAT
                </p>
                <p className="text-xs text-gray-500">
                  Deluxe & Premium members receive prioritized under-1-hour escalation.
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: SB.ink }}>
              Looking for immediate answers?
            </h2>
            <p className="text-sm opacity-85" style={{ color: SB.ink }}>
              Check our comprehensive tax guides and FAQ repository covering the 2024 VAT
              amendments, personal relief thresholds, and withholding rates.
            </p>
          </div>
          <Link
            to="/news"
            className="border-2 px-8 py-3 rounded-xl font-bold transition-all hover:bg-[#18623f]/10 active:scale-95 inline-flex items-center gap-2"
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
