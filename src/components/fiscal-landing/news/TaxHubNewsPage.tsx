import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  ChevronDown,
  FileText,
  Hash,
  Image,
  Link2,
  MessageCircle,
  Plus,
  Receipt,
  Share2,
  TrendingUp,
  Verified,
  Wallet,
  Sparkles,
} from "lucide-react";
import { notify } from "@/components/Toaster";

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

type Vote = "up" | "down" | null;

const COMMUNITIES = [
  { label: "Tax Hub", to: "/news", icon: Hash, active: true },
  { label: "Rent Receipts", to: "/rent-receipt", icon: Receipt },
  { label: "Tax Filing", to: "/taxes", icon: Wallet },
  { label: "Document Renewal", to: "/document-renewal", icon: FileText },
  { label: "E-Invoicing", to: "/e-invoicing", icon: Receipt },
];

const POSTS = [
  {
    id: "1",
    badge: "Official Update",
    badgeStyle: { bg: "#d5f5c2", color: "#1a3300" },
    author: "FIRS_Official",
    time: "2 hours ago",
    title: "New Digital E-Invoicing Requirements for 2024 Tax Season",
    body: "The Federal Inland Revenue Service has announced new compliance standards for digital invoice submission. All taxpayers registered under the VAT scheme must transition to the new secure API by December…",
    votes: "1.2k",
    comments: 245,
    image: null as string | null,
  },
  {
    id: "2",
    badge: "Community Tip",
    badgeStyle: { bg: "#ffe95c", color: "#1a3300" },
    author: "AdebayoTaxPro",
    time: "5 hours ago",
    title: "How to maximize your Rent Receipt deductions if you're working from home",
    body: "If your primary residence is also your office, you might be eligible to deduct a portion of your rent as a business expense. Here's the step-by-step guide for freelancers…",
    votes: "842",
    comments: 112,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzMbplKYyYfeup77QZcI0MtGISITgE9xR0q4DTIKheZ5fLbY_HL5MfrAfJjLZrBCBpfUZ3Dagh8NiprKG2WYDJdBGFDbfY0e_oGdW4sqrIQQiG1HD2144KYW4Vr2yiXtk1RnMn6uYAirRiAYseodbE8ofuXcYWiGd-of3EVT7vvGDDJfLT0ERf9oj3wkWv-skbZf6RcYwqOu8rhP4WAy8CKUbWdf8d71z8u_2AMwf7z0COHq_c9X7gbcBe8635uXjdSOfkfGCUdjrC",
  },
  {
    id: "3",
    badge: "Discussion",
    badgeStyle: { bg: "#f1f1f1", color: "#6b6b6b" },
    author: "Chidi_Fintech",
    time: "12 hours ago",
    title: "Driver's License Renewal: Anyone experiencing delays at the Ikoyi office?",
    body: "Tried to renew my license last Tuesday and was told the system was down for scheduled maintenance. Has anyone been able to successfully capture their biometrics since then?",
    votes: "56",
    comments: 89,
    image: null,
  },
];

function VoteRail({ votes, vote, onUp, onDown }: { votes: string; vote: Vote; onUp: () => void; onDown: () => void }) {
  return (
    <div
      className="w-12 flex flex-col items-center py-4 gap-1 rounded-l-xl shrink-0 border-r"
      style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
    >
      <button
        type="button"
        onClick={onUp}
        className="p-1 transition-all duration-200 hover:scale-110 active:scale-90 rounded"
        style={{ color: vote === "up" ? SB.ink : SB.pencil }}
        aria-label="Upvote"
      >
        <ArrowUp className="w-5 h-5" fill={vote === "up" ? "currentColor" : "none"} />
      </button>
      <span className="text-sm font-bold" style={{ color: SB.ink }}>{votes}</span>
      <button
        type="button"
        onClick={onDown}
        className="p-1 transition-all duration-200 hover:scale-110 active:scale-90 rounded"
        style={{ color: vote === "down" ? "#991b1b" : SB.pencil }}
        aria-label="Downvote"
      >
        <ArrowDown className="w-5 h-5" fill={vote === "down" ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

export default function TaxHubNewsPage() {
  const [filter, setFilter] = useState<"Hot" | "New" | "Top">("Hot");
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  const headerRef = useScrollAnimation(0.1);
  const sidebarRef = useScrollAnimation(0.1);
  const postsRef = useScrollAnimation(0.05);
  const rightRef = useScrollAnimation(0.1);

  const toggleVote = (id: string, dir: "up" | "down") => {
    setVotes((prev) => {
      const cur = prev[id] ?? null;
      if (cur === dir) return { ...prev, [id]: null };
      return { ...prev, [id]: dir };
    });
  };

  return (
    <main className="relative overflow-hidden pt-8 md:pt-12" style={{ backgroundColor: SB.cream }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(${SB.ink} 1px, transparent 1px)`, backgroundSize: "36px 36px" }}
        />
      </div>

      {/* Header */}
      <section
        ref={headerRef.ref}
        className={`pt-12 md:pt-20 pb-6 md:pb-10 px-5 md:px-10 max-w-[1280px] mx-auto text-center transition-all duration-1000 ${
          headerRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
          style={{ borderColor: SB.cardBorder, color: SB.ink, backgroundColor: SB.mint }}
        >
          <Sparkles className="w-4 h-4" />
          Community Hub
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: SB.ink }}>
          Tax Hub Community
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto" style={{ color: SB.muted }}>
          Connect with fellow Nigerians, share tax insights, and stay updated with official FIRS announcements.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          {[
            { label: "Members", value: "125k" },
            { label: "Online now", value: "1.2k" },
            { label: "New discussions", value: "372" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border p-4 shadow-sm hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="text-sm uppercase tracking-wide font-semibold" style={{ color: SB.pencil }}>
                {item.label}
              </div>
              <div className="mt-3 text-2xl font-bold" style={{ color: SB.ink }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left sidebar */}
          <aside
            ref={sidebarRef.ref}
            className={`md:col-span-3 space-y-6 transition-all duration-1000 delay-100 ${
              sidebarRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div
              className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: SB.pencil }}>
                Communities
              </h3>
              <nav className="space-y-1">
                {COMMUNITIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.label}
                      to={c.to}
                      className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200"
                      style={
                        c.active
                          ? { backgroundColor: SB.mint, color: SB.ink, fontWeight: 700 }
                          : { color: SB.muted }
                      }
                      onMouseEnter={(e) => { if (!c.active) (e.currentTarget as HTMLElement).style.backgroundColor = SB.cream; }}
                      onMouseLeave={(e) => { if (!c.active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      <Icon className="w-5 h-5" />
                      {c.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div
              className="rounded-2xl border p-5 hover:shadow-md transition-shadow"
              style={{ backgroundColor: "#d5f5c2", borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-2 mb-3" style={{ color: SB.ink }}>
                <Verified className="w-5 h-5 fill-current" />
                <span className="text-sm font-bold">Official Updates</span>
              </div>
              <p className="text-xs mb-4" style={{ color: SB.muted }}>
                Stay informed with the latest FIRS directives and portal maintenance alerts.
              </p>
              <button
                type="button"
                className="w-full py-2 text-sm font-bold rounded-lg hover:shadow-md active:scale-95 transition-all"
                style={{ backgroundColor: SB.ink, color: SB.cream }}
                onClick={() => notify.success("Following", "You will receive official FIRS updates.")}
              >
                Follow Official
              </button>
            </div>
          </aside>

          {/* Main feed */}
          <section
            ref={postsRef.ref}
            className={`md:col-span-6 space-y-4 transition-all duration-1000 delay-200 ${
              postsRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Create post */}
            <div
              className="rounded-[2rem] border p-5 grid gap-4 shadow-sm hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#d5f5c2] shrink-0">
                  <img
                    alt="User"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeXaTwm_9LSZdrXu5uIs33NG7ZrgMEp1NVcVqigNN0fuVZ_fx2lV63DQPMe_OX6-uRI6R6KkayKYVC1zK8-T31pYkYuivhkuhBeg4blrNfTftfQnqewBi-f6opAveCV0-42bVm1kRIfZuhyXJ1vcHjc-HKJUs-6LPdQc6PDliXU_bjSF9uu4O-fX831rq-P-VkpjmPVfNt33hbHWwRLIz0_43Dh2eXEH6EImDg1yfKz_nDXkDjowR7tb0ZdqXJP-uZRXiKw1eGmu6r"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: SB.ink }}>
                    Share a community update
                  </p>
                  <p className="text-xs" style={{ color: SB.pencil }}>
                    Quick post, question, or useful link.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Start a discussion or ask a question..."
                  className="flex-1 rounded-3xl p-4 text-sm outline-none border focus:ring-2 focus:ring-[#1a3300]/20 focus:border-[#1a3300] placeholder:text-gray-400 transition-all duration-200"
                  style={{ backgroundColor: "#f1f1f1", borderColor: SB.cardBorder, color: SB.ink }}
                />
                <button type="button" className="p-3 rounded-2xl border border-transparent hover:border-current transition-all duration-200" aria-label="Add image" style={{ color: SB.pencil }}>
                  <Image className="w-5 h-5" />
                </button>
                <button type="button" className="p-3 rounded-2xl border border-transparent hover:border-current transition-all duration-200" aria-label="Add link" style={{ color: SB.pencil }}>
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ backgroundColor: SB.ink, color: SB.cream }}
                  onClick={() => notify.info("Create post", "Sign in to publish to Tax Hub.")}
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex gap-2 py-2 overflow-x-auto">
              {(["Hot", "New", "Top"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 border"
                  style={
                    filter === f
                      ? { backgroundColor: SB.ink, color: SB.cream, borderColor: SB.ink }
                      : { backgroundColor: SB.white, color: SB.muted, borderColor: SB.cardBorder }
                  }
                >
                  {f}
                </button>
              ))}
              <div className="h-6 w-px mx-2 self-center" style={{ backgroundColor: SB.cardBorder }} />
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center gap-2 border active:scale-95 transition"
                style={{ borderColor: SB.cardBorder, color: SB.muted, backgroundColor: SB.white }}
              >
                Lagos <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Posts */}
            {POSTS.map((post, index) => (
              <article
                key={post.id}
                className={`rounded-3xl border flex overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
                  postsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  backgroundColor: SB.white,
                  borderColor: SB.cardBorder,
                  transitionDelay: postsRef.isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <VoteRail
                  votes={post.votes}
                  vote={votes[post.id] ?? null}
                  onUp={() => toggleVote(post.id, "up")}
                  onDown={() => toggleVote(post.id, "down")}
                />
                <div className="flex-1 p-4 md:p-5 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full"
                      style={{ backgroundColor: post.badgeStyle.bg, color: post.badgeStyle.color }}
                    >
                      {post.badge}
                    </span>
                    <span className="text-xs" style={{ color: SB.pencil }}>•</span>
                    <span className="text-xs font-bold" style={{ color: SB.ink }}>{post.author}</span>
                    <span className="text-xs" style={{ color: SB.pencil }}>{post.time}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold mb-2 leading-tight" style={{ color: SB.ink }}>{post.title}</h2>
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: SB.muted }}>{post.body}</p>
                  {post.image && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { icon: MessageCircle, label: `${post.comments} Comments` },
                      { icon: Share2, label: "Share" },
                      { icon: Bookmark, label: "Save" },
                    ].map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        type="button"
                        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[#fcfaf5] active:scale-95 transition"
                        style={{ color: SB.muted }}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Right sidebar */}
          <aside
            ref={rightRef.ref}
            className={`md:col-span-3 space-y-6 transition-all duration-1000 delay-300 ${
              rightRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Community card */}
            <div
              className="rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="h-16" style={{ backgroundColor: SB.ink }} />
              <div className="p-6 -mt-8">
                <div className="flex items-end gap-3 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center border-4 shadow-md"
                    style={{ borderColor: SB.white, backgroundColor: SB.yellow }}
                  >
                    <Hash className="w-8 h-8" style={{ color: SB.ink }} />
                  </div>
                  <span className="text-xl font-bold" style={{ color: SB.ink }}>Tax Hub</span>
                </div>
                <p className="text-sm mb-4" style={{ color: SB.muted }}>
                  The largest Nigerian community for tax filing, compliance, and financial management.
                </p>
                <div className="flex justify-between mb-6 text-sm">
                  <div>
                    <div className="font-bold" style={{ color: SB.ink }}>125k</div>
                    <div className="text-xs" style={{ color: SB.pencil }}>Members</div>
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1" style={{ color: SB.ink }}>
                      <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: "#1a5c3a" }} />
                      1.2k
                    </div>
                    <div className="text-xs" style={{ color: SB.pencil }}>Online</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-3 font-bold rounded-lg mb-3 text-sm hover:opacity-90 active:scale-95 transition"
                  style={{ backgroundColor: SB.yellow, color: SB.ink }}
                  onClick={() => notify.info("Create post", "Sign in to publish to Tax Hub.")}
                >
                  Create Post
                </button>
                <button
                  type="button"
                  className="w-full py-3 border font-bold rounded-lg text-sm hover:bg-[#fcfaf5] active:scale-95 transition"
                  style={{ borderColor: SB.cardBorder, color: SB.ink }}
                >
                  Joined
                </button>
              </div>
            </div>

            {/* Trending */}
            <div
              className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: SB.pencil }}>
                Trending Niches
              </h3>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, label: "E-Invoicing", meta: "4.2k Posts" },
                  { icon: FileText, label: "Rent Receipts", meta: "1.8k Posts" },
                  { icon: Wallet, label: "Tax Filing", meta: "890 Posts" },
                ].map(({ icon: Icon, label, meta }) => (
                  <div key={label} className="flex items-center gap-3 hover:translate-x-1 transition-transform">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: SB.mint }}>
                      <Icon className="w-4 h-4" style={{ color: SB.ink }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: SB.ink }}>{label}</div>
                      <div className="text-[10px] uppercase" style={{ color: SB.pencil }}>{meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div
              className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: SB.pencil }}>
                Community Rules
              </h3>
              <ol className="space-y-2 text-sm" style={{ color: SB.muted }}>
                {[
                  "Be respectful and professional in discussions.",
                  "Cite official FIRS sources when sharing tax advice.",
                  "No self-promotion of unverified filing services.",
                ].map((rule, i) => (
                  <li key={rule} className="flex gap-2">
                    <span className="font-bold shrink-0" style={{ color: SB.ink }}>{i + 1}.</span>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        type="button"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 hover:scale-110"
        style={{ backgroundColor: SB.yellow, color: SB.ink }}
        onClick={() => notify.info("Create post", "Sign in to publish to Tax Hub.")}
        aria-label="Create post"
      >
        <Plus className="w-7 h-7" />
      </button>
    </main>
  );
}
