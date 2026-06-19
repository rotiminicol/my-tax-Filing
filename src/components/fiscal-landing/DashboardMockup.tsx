/**
 * DashboardMockup — accurate scaled replica of the real dashboard UI.
 * Shown in the hero section of the landing page.
 *
 * Design tokens and layout mirror FiscalDashboardShell + RentReceiptPage
 * exactly, scaled to approximately 75% of the real viewport.
 */

import {
  AlertTriangle,
  Bell,
  Building2,
  Calculator,
  ChevronRight,
  CircleUser,
  Clock,
  Download,
  FilePlus,
  LayoutDashboard,
  Receipt,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Settings,
  TrendingUp,
  Upload,
} from "lucide-react";

// ── Real dashboard tokens (matches dashboardTokens.ts) ──────────────
const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const MINT = "#d5f5c2";
const TEAL = "#a8e5e5";
const BLUSH = "#f6d0ff";
const PENCIL = "#b6b6b6";
const WHITE = "#ffffff";
const WHISPER = "#f1f1f1";
const CARD_BORDER = "rgba(26,51,0,0.10)";
const HEADER_BORDER = "rgba(26,51,0,0.12)";
const SIDEBAR_DIVIDER = "rgba(252,250,245,0.12)";
const SIDEBAR_TEXT = "rgba(252,250,245,0.82)";
const SIDEBAR_MUTED = "rgba(252,250,245,0.38)";
const SIDEBAR_HOVER = "rgba(255,233,92,0.12)";

// ── Nav items — mirrors MAIN_NAV in fiscalNav.ts ────────────────────
const MAIN_NAV: {
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
}[] = [
  { label: "Home", icon: LayoutDashboard },
  { label: "Rent Receipt", icon: Building2, active: true },
  { label: "Taxes", icon: Calculator },
  { label: "Document Renewal", icon: RefreshCw },
  { label: "E-Invoicing", icon: ReceiptText },
];

// ── Stat cards — mirrors STAT_CARDS in RentReceiptPage ──────────────
const STAT_CARDS = [
  {
    icon: Receipt,
    label: "Total issued",
    value: "12",
    sub: "9 generated",
    bg: MINT,
  },
  {
    icon: TrendingUp,
    label: "Total claimed",
    value: "₦18.4M",
    sub: "Across all receipts",
    bg: TEAL,
  },
  {
    icon: Clock,
    label: "Pending review",
    value: "3",
    sub: "Awaiting signature",
    bg: YELLOW,
  },
  {
    icon: AlertTriangle,
    label: "Filing deadline",
    value: "47 days",
    sub: "Due 31 May 2026",
    bg: BLUSH,
  },
] as const;

// ── Quick actions — mirrors QUICK_ACTIONS in RentReceiptPage ────────
const QUICK_ACTIONS = [
  { icon: FilePlus, label: "New receipt", desc: "4-step wizard", bg: MINT },
  { icon: Upload, label: "Batch import", desc: "Upload CSV/Excel", bg: TEAL },
  { icon: Download, label: "Export all", desc: "PDF bundle", bg: YELLOW },
  { icon: Send, label: "Share to employer", desc: "Email or link", bg: BLUSH },
] as const;

// ── Receipt rows — realistic Nigerian names & addresses ─────────────
const RECEIPTS = [
  {
    name: "Adaeze Okonkwo",
    addr: "14 Wuse II, Abuja",
    amount: "₦1,800,000",
    year: "2026",
    avBg: MINT,
    status: "Generated",
  },
  {
    name: "Emeka Nwachukwu",
    addr: "7 Garki District, FCT",
    amount: "₦2,400,000",
    year: "2026",
    avBg: TEAL,
    status: "Generated",
  },
  {
    name: "Fatima Al-Hassan",
    addr: "22 Maitama, Abuja",
    amount: "₦3,600,000",
    year: "2025",
    avBg: YELLOW,
    status: "Pending",
  },
  {
    name: "Chukwuemeka Eze",
    addr: "5 Asokoro Drive, FCT",
    amount: "₦1,200,000",
    year: "2025",
    avBg: BLUSH,
    status: "Generated",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function DashboardMockup() {
  return (
    <div
      style={{
        width: "100%",
        height: 508,
        display: "flex",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundColor: CREAM,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {/* ═══════════════════════════════════════════════════════════
          SIDEBAR — mirrors FiscalDashboardShell sidebar (256px real,
          scaled to 196px at ~76%)
      ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          width: 196,
          backgroundColor: INK,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow: "2px 0 10px rgba(26,51,0,0.14)",
        }}
      >
        {/* Sidebar header — brand */}
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            borderBottom: `1px solid ${SIDEBAR_DIVIDER}`,
            gap: 9,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: YELLOW,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 900,
                color: INK,
                letterSpacing: "-0.01em",
              }}
            >
              MTF
            </span>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: CREAM,
                letterSpacing: "0.01em",
                lineHeight: 1.2,
              }}
            >
              My Tax Filing
            </div>
            <div
              style={{
                fontSize: 7,
                color: SIDEBAR_MUTED,
                letterSpacing: "0.1em",
                marginTop: 1,
              }}
            >
              TAX PLATFORM
            </div>
          </div>
        </div>

        {/* Plan summary */}
        <div
          style={{
            padding: "8px 14px 9px",
            borderBottom: `1px solid ${SIDEBAR_DIVIDER}`,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: CREAM }}>
            Dashboard
          </div>
          <div style={{ fontSize: 7.5, color: SIDEBAR_MUTED, marginTop: 2 }}>
            Deluxe Plan · Active
          </div>
        </div>

        {/* Main navigation */}
        <div style={{ padding: "6px 8px", flex: 1 }}>
          {MAIN_NAV.map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 9px",
                borderRadius: 8,
                marginBottom: 2,
                backgroundColor: active ? YELLOW : "transparent",
                color: active ? INK : SIDEBAR_TEXT,
                fontWeight: active ? 700 : 500,
                cursor: "default",
              }}
            >
              <Icon
                style={{
                  width: 13,
                  height: 13,
                  flexShrink: 0,
                  opacity: active ? 1 : 0.88,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.005em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Account nav */}
        <div
          style={{
            padding: "5px 8px",
            borderTop: `1px solid ${SIDEBAR_DIVIDER}`,
          }}
        >
          {[
            { label: "Settings", icon: Settings },
            { label: "Profile", icon: CircleUser },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 9px",
                borderRadius: 7,
                marginBottom: 2,
                color: SIDEBAR_TEXT,
                cursor: "default",
                opacity: 0.85,
              }}
            >
              <Icon style={{ width: 11, height: 11, flexShrink: 0 }} />
              <span style={{ fontSize: 9.5 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* User card at bottom */}
        <div
          style={{
            padding: "8px 12px 12px",
            borderTop: `1px solid ${SIDEBAR_DIVIDER}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: MINT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8.5,
                fontWeight: 800,
                color: INK,
                flexShrink: 0,
              }}
            >
              AO
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: CREAM,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Adaeze Okonkwo
              </div>
              <div
                style={{ fontSize: 7.5, color: SIDEBAR_MUTED, marginTop: 1.5 }}
              >
                Deluxe Plan
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* ── Top Header — cream, with search + icons ── */}
        <div
          style={{
            height: 54,
            backgroundColor: CREAM,
            borderBottom: `1px solid ${HEADER_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
          }}
        >
          {/* Search bar */}
          <div style={{ position: "relative", flex: 1, maxWidth: 260 }}>
            <Search
              style={{
                position: "absolute",
                left: 9,
                top: "50%",
                transform: "translateY(-50%)",
                width: 12,
                height: 12,
                color: PENCIL,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: "100%",
                height: 30,
                backgroundColor: WHISPER,
                borderRadius: 8,
                border: `1px solid ${CARD_BORDER}`,
                paddingLeft: 28,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 9.5, color: PENCIL }}>
                Search receipts, tenants...
              </span>
            </div>
          </div>

          {/* Right: Bell + Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Notification bell with dot */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: WHISPER,
                  border: `1px solid ${CARD_BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell style={{ width: 12, height: 12, color: INK }} />
              </div>
              {/* Notification dot */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 7,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  border: `1.5px solid ${CREAM}`,
                }}
              />
            </div>

            {/* User avatar */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: MINT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 800,
                color: INK,
                border: `1.5px solid rgba(26,51,0,0.14)`,
              }}
            >
              AO
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "14px 20px 14px",
            backgroundColor: CREAM,
            display: "flex",
            flexDirection: "column",
            gap: 11,
          }}
        >
          {/* Page title + action */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: INK,
                  letterSpacing: "-0.025em",
                  fontFamily:
                    "'Bricolage Grotesque', 'Archivo Black', sans-serif",
                  lineHeight: 1.2,
                }}
              >
                Rent Receipts
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: PENCIL,
                  marginTop: 2.5,
                  letterSpacing: "0.005em",
                }}
              >
                2026 tax year overview · FCT-IRS compliant
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                backgroundColor: INK,
                color: CREAM,
                borderRadius: 7,
                padding: "6px 11px",
                fontSize: 9.5,
                fontWeight: 700,
                cursor: "default",
              }}
            >
              <FilePlus style={{ width: 11, height: 11 }} />
              New Receipt
            </div>
          </div>

          {/* ── Stats row ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {STAT_CARDS.map(({ icon: Icon, label, value, sub, bg }) => (
              <div
                key={label}
                style={{
                  backgroundColor: bg,
                  borderRadius: 10,
                  padding: "10px 11px",
                  border: "1.5px solid rgba(26,51,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 6,
                  }}
                >
                  <Icon
                    style={{ width: 11, height: 11, color: INK, opacity: 0.65 }}
                  />
                  <span
                    style={{
                      fontSize: 7.5,
                      fontWeight: 700,
                      color: INK,
                      opacity: 0.6,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.07em",
                    }}
                  >
                    {label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: INK,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: INK,
                    opacity: 0.5,
                    marginTop: 3,
                  }}
                >
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── Content grid: Quick actions (left) + Recent receipts (right) ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Quick actions card */}
            <div
              style={{
                backgroundColor: WHITE,
                borderRadius: 10,
                border: `1px solid ${CARD_BORDER}`,
                padding: "10px 12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: PENCIL,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Quick Actions
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {QUICK_ACTIONS.map(({ icon: Icon, label, desc, bg }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 9px",
                      borderRadius: 8,
                      border: `1px solid ${CARD_BORDER}`,
                      cursor: "default",
                    }}
                  >
                    <div
                      style={{
                        width: 27,
                        height: 27,
                        backgroundColor: bg,
                        borderRadius: 7,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: 11, height: 11, color: INK }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 600,
                          color: INK,
                          lineHeight: 1.3,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{ fontSize: 7.5, color: PENCIL, marginTop: 1.5 }}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent receipts card */}
            <div
              style={{
                backgroundColor: WHITE,
                borderRadius: 10,
                border: `1px solid ${CARD_BORDER}`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "9px 12px",
                  borderBottom: `1px solid ${CARD_BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: PENCIL,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                  }}
                >
                  Recent Receipts
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: 8,
                    fontWeight: 600,
                    color: INK,
                    opacity: 0.55,
                    cursor: "default",
                  }}
                >
                  View all
                  <ChevronRight style={{ width: 9, height: 9 }} />
                </div>
              </div>

              {/* Receipt rows */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                {RECEIPTS.map((r, i) => (
                  <div
                    key={r.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderBottom:
                        i < RECEIPTS.length - 1
                          ? `1px solid ${CARD_BORDER}`
                          : "none",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        backgroundColor: r.avBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 800,
                        color: INK,
                        flexShrink: 0,
                      }}
                    >
                      {initials(r.name)}
                    </div>

                    {/* Name + address */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: INK,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.name}
                      </div>
                      <div
                        style={{
                          fontSize: 7.5,
                          color: PENCIL,
                          marginTop: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.addr}
                      </div>
                    </div>

                    {/* Amount + year */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{ fontSize: 9.5, fontWeight: 800, color: INK }}
                      >
                        {r.amount}
                      </div>
                      <div
                        style={{ fontSize: 7.5, color: PENCIL, marginTop: 1.5 }}
                      >
                        FY {r.year}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        padding: "2.5px 7px",
                        borderRadius: 20,
                        fontSize: 7,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        backgroundColor:
                          r.status === "Generated" ? MINT : YELLOW,
                        color: INK,
                        flexShrink: 0,
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {r.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
