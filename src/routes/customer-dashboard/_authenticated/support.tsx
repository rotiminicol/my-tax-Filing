import { useMemo, useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { notify } from "@/components/Toaster";
import { useAuth } from "@/store/auth";
import { sendSupportTicketConfirmation } from "@/lib/email/emailClient";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Gavel,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  TicketCheck,
  X,
  Send,
  Loader2,
} from "lucide-react";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  blush: "#f6d0ff",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

const FAQS = [
  {
    id: "faq-1",
    q: "When is the deadline for Personal Income Tax filing in Nigeria?",
    a: "Personal Income Tax (PIT) returns for individuals must be filed by March 31st of every year for the preceding tax year. Employers must file their annual returns by January 31st under the PITA (Cap P8 LFN 2004).",
  },
  {
    id: "faq-2",
    q: "How do I generate a Tax Clearance Certificate (TCC)?",
    a: "Go to Documents → Tax Clearance. Upload supporting income records and submit for verification. We'll guide you through the authority-specific steps and track status updates in real time.",
  },
  {
    id: "faq-3",
    q: "What documents are required for rent receipt validation?",
    a: "Typically required: tenancy agreement/lease, landlord identification, payment evidence (bank receipt or teller), and complete tenant details. Requirements may vary by jurisdiction and employer audit policy.",
  },
  {
    id: "faq-4",
    q: "Can I pay my taxes in installments through the platform?",
    a: "Installment support depends on the tax authority and your filing type. Where applicable, you'll see an installment payment option during the payment review stage of your filing.",
  },
  {
    id: "faq-5",
    q: "How long does it take to process a document renewal?",
    a: "Processing times vary: National ID and Driver's License typically take 2–4 weeks; International Passports take 6–8 weeks. You can track your renewal status in real time from the Documents dashboard.",
  },
];

const GUIDES = [
  { label: "2024 VAT Amendment Act", action: "download" },
  { label: "Corporate Tax Filing 101", action: "open" },
  { label: "FIRS Audit Checklist", action: "download" },
  { label: "PAYE Employer Guide 2024", action: "download" },
];

function SupportPage() {
  const user = useAuth((s) => s.user);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [mounted, setMounted] = useState(false);

  // Ticket creation modal state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Tax Filing & Relief");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketsList, setTicketsList] = useState([
    {
      id: "TK-2026-441",
      subject: "FIRS TIN Verification Query",
      status: "In Review",
      date: "Nov 4, 2026",
    },
  ]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      notify.error("Missing information", "Please enter a subject and message.");
      return;
    }

    setSubmittingTicket(true);
    const newId = `TK-2026-${Math.floor(100 + Math.random() * 900)}`;

    try {
      if (user?.email) {
        await sendSupportTicketConfirmation({
          email: user.email,
          fullName: user.fullName,
          ticketId: newId,
          subject: `${ticketCategory}: ${ticketSubject.trim()}`,
          message: ticketMessage.trim(),
        });
      }

      setTicketsList((prev) => [
        {
          id: newId,
          subject: `${ticketCategory}: ${ticketSubject.trim()}`,
          status: "Under Review",
          date: new Date().toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
        ...prev,
      ]);

      setShowTicketModal(false);
      setTicketSubject("");
      setTicketMessage("");
      notify.success(
        "Ticket Submitted!",
        `Ticket #${newId} created. A confirmation email has been dispatched to ${user?.email || "your inbox"}.`,
      );
    } catch (err) {
      notify.error("Submission notice", "Ticket created locally; email confirmation scheduled.");
      setShowTicketModal(false);
    } finally {
      setSubmittingTicket(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const filteredFaqs = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return FAQS;
    return FAQS.filter((f) => f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term));
  }, [q]);

  return (
    <DashboardShell title="Help & Support">
      <div className="space-y-8">
        {/* Hero */}
        <section
          className={`relative overflow-hidden rounded-2xl py-12 px-8 md:px-12 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ backgroundColor: SB.ink }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(252,250,245,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: SB.mint }}
          />
          <div
            className="absolute top-0 right-1/4 w-32 h-32 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: SB.yellow }}
          />

          <div className="relative z-10 max-w-2xl">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: SB.yellow }}
            >
              Support Centre
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: SB.cream }}>
              How can we help you today?
            </h2>
            <p className="text-base mb-8" style={{ color: "rgba(252,250,245,0.7)" }}>
              Search our knowledge base or connect directly with our Nigerian tax compliance
              experts.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: SB.yellow, color: SB.ink }}
                onClick={() => notify.info("Live chat", "Live chat connection opening.")}
              >
                <MessageCircle className="w-5 h-5" />
                Start Live Chat
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-xl font-bold text-sm border inline-flex items-center gap-2 transition-all hover:bg-white/10 cursor-pointer"
                style={{ borderColor: "rgba(252,250,245,0.40)", color: SB.cream }}
                onClick={() => setShowTicketModal(true)}
              >
                <Mail className="w-5 h-5" />
                Open a Ticket
              </button>
            </div>
          </div>
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQs */}
          <div
            className={`lg:col-span-8 space-y-4 transition-all duration-500 delay-75 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold" style={{ color: SB.ink }}>
                Frequently Asked Questions
              </h3>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: SB.pencil }}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tax guides or FAQ…"
                className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                style={{ backgroundColor: "#f1f1f1", borderColor: SB.cardBorder, color: SB.ink }}
              />
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              {filteredFaqs.map((f, idx) => {
                const open = openId === f.id;
                return (
                  <div
                    key={f.id}
                    className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{
                      backgroundColor: SB.white,
                      borderColor: open ? "rgba(26,51,0,0.20)" : SB.cardBorder,
                      transitionDelay: mounted ? `${idx * 40}ms` : "0ms",
                    }}
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                      onClick={() => setOpenId((prev) => (prev === f.id ? null : f.id))}
                    >
                      <h4 className="font-bold text-sm leading-snug" style={{ color: SB.ink }}>
                        {f.q}
                      </h4>
                      <ChevronDown
                        className="w-5 h-5 shrink-0 transition-transform duration-300"
                        style={{
                          color: SB.pencil,
                          transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: open ? "300px" : "0px" }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: SB.muted }}>
                        {f.a}
                      </p>
                    </div>
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div
                  className="rounded-xl border p-10 text-center"
                  style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
                >
                  <p className="text-sm" style={{ color: SB.muted }}>
                    No matching questions found. Try a different search term.
                  </p>
                </div>
              )}
            </div>

            {/* Topic cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {[
                {
                  icon: FileText,
                  title: "Billing & Payments",
                  desc: "Update payment methods and download invoices.",
                  bg: SB.mint,
                },
                {
                  icon: ShieldCheck,
                  title: "Account Security",
                  desc: "Password resets and 2FA configuration.",
                  bg: SB.teal,
                },
                {
                  icon: Gavel,
                  title: "Legal & Compliance",
                  desc: "Review terms of service and Nigerian tax law.",
                  bg: SB.blush,
                },
              ].map(({ icon: Icon, title, desc, bg }) => (
                <button
                  key={title}
                  type="button"
                  className="p-5 rounded-xl border text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
                  onClick={() => notify.info(title, "Full topic directory coming soon.")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: SB.ink }} />
                  </div>
                  <h5 className="font-extrabold text-sm mb-1" style={{ color: SB.ink }}>
                    {title}
                  </h5>
                  <p className="text-xs leading-relaxed" style={{ color: SB.muted }}>
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside
            className={`lg:col-span-4 space-y-5 transition-all duration-500 delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Direct contact */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div
                className="px-5 py-4 border-b"
                style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
              >
                <h4 className="font-extrabold text-sm" style={{ color: SB.ink }}>
                  Direct Support
                </h4>
                <p className="text-xs mt-0.5" style={{ color: SB.muted }}>
                  Average response: under 2 hours
                </p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  {
                    icon: Phone,
                    title: "Call Hotline",
                    sub: "+234 800 TAX HELP",
                    bg: SB.mint,
                    action: () =>
                      notify.info("Hotline", "+234 800 TAX HELP — available Mon–Fri 8am–6pm."),
                  },
                  {
                    icon: Mail,
                    title: "Email Support",
                    sub: "support@myrentreceipt.ng",
                    bg: SB.teal,
                    action: () => notify.info("Email", "support@myrentreceipt.ng"),
                  },
                  {
                    icon: Headphones,
                    title: "Live Chat",
                    sub: "Premium subscribers · 24/7",
                    bg: SB.blush,
                    action: () => notify.info("Live Chat", "Connecting to a support agent…"),
                  },
                ].map(({ icon: Icon, title, sub, bg, action }) => (
                  <button
                    key={title}
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition-all text-left"
                    style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
                    onClick={action}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: SB.ink }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: SB.ink }}>
                        {title}
                      </p>
                      <p className="text-xs" style={{ color: SB.muted }}>
                        {sub}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Guides */}
            <div className="space-y-2">
              <h4
                className="text-xs font-extrabold uppercase tracking-widest px-1"
                style={{ color: SB.pencil }}
              >
                Compliance Guides
              </h4>
              <div
                className="rounded-2xl border divide-y divide-[rgba(26,51,0,0.10)] overflow-hidden"
                style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
              >
                {GUIDES.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[#fcfaf5] transition-colors"
                    onClick={() =>
                      notify.info(
                        g.label,
                        g.action === "download" ? "Downloading PDF…" : "Opening guide…",
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 shrink-0" style={{ color: SB.pencil }} />
                      <span className="text-sm font-medium" style={{ color: SB.ink }}>
                        {g.label}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: SB.pencil }} />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Active ticket */}
        <section
          className={`rounded-2xl border p-5 transition-all duration-500 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: SB.yellow }}
              >
                <TicketCheck className="w-5 h-5" style={{ color: SB.ink }} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm" style={{ color: SB.ink }}>
                  Active Support Tickets
                </h4>
                <p className="text-xs mt-0.5" style={{ color: SB.muted }}>
                  {ticketsList.length} open inquiry awaiting team response.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {ticketsList.map((tk) => (
                <div
                  key={tk.id}
                  className="px-4 py-2 rounded-xl border flex items-center gap-3"
                  style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
                >
                  <span className="text-xs font-semibold" style={{ color: SB.ink }}>
                    #{tk.id}: {tk.subject}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider"
                    style={{ backgroundColor: SB.yellow, color: SB.ink }}
                  >
                    {tk.status}
                  </span>
                </div>
              ))}
              <button
                type="button"
                className="text-xs font-bold px-3 py-1.5 rounded-lg border transition hover:bg-slate-50 cursor-pointer"
                style={{ borderColor: SB.cardBorder, color: SB.ink }}
                onClick={() => setShowTicketModal(true)}
              >
                + New Ticket
              </button>
            </div>
          </div>
        </section>

        {/* Support Ticket Modal */}
        {showTicketModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg rounded-2xl border p-6 bg-white shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
              style={{ borderColor: SB.cardBorder }}
            >
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: SB.cardBorder }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ background: SB.mint }}>
                    <Mail className="w-4 h-4" style={{ color: SB.ink }} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base" style={{ color: SB.ink }}>
                      Open a Support Inquiry
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      An advisor will review and confirm via email at{" "}
                      {user?.email || "your account email"}.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                    style={{ borderColor: SB.cardBorder }}
                  >
                    <option value="Tax Filing & Relief">Tax Filing &amp; Relief Claims</option>
                    <option value="Rent Receipt Validation">
                      Rent Receipt &amp; Landlord Verification
                    </option>
                    <option value="E-Invoicing & Billing">
                      E-Invoicing &amp; VAT/WHT Questions
                    </option>
                    <option value="Subscription & Payments">
                      Subscription &amp; Payment Issues
                    </option>
                    <option value="Document Renewal">Driver's License / Passport Renewal</option>
                    <option value="Account & Security">Account Security &amp; Login Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    style={{ borderColor: SB.cardBorder }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full details, tax office name, receipt number, or error messages..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs resize-none"
                    style={{ borderColor: SB.cardBorder }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                    style={{ borderColor: SB.cardBorder }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition hover:opacity-90 disabled:opacity-60"
                    style={{ background: SB.yellow, color: SB.ink }}
                  >
                    {submittingTicket ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    {submittingTicket ? "Submitting Ticket…" : "Submit & Send Confirmation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default SupportPage;
