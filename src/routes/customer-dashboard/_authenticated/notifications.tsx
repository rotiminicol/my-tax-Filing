import { useMemo, useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";
import { planDisplayName } from "@/lib/planConfig";
import { notify } from "@/components/Toaster";
import { onAppNotification } from "@/lib/events";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  RefreshCw,
  Shield,
  X,
} from "lucide-react";

const SB = {
  ink: "#1a3300",
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

type Chip = "all" | "deadlines" | "receipts" | "system";
type NType = "important" | "standard" | "alert" | "feature";

interface NotificationItem {
  id: string;
  type: NType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  chip: Exclude<Chip, "all">;
}

const SEEDED: NotificationItem[] = [];

function NotificationsPage() {
  const user = useAuth((s) => s.user);
  const [chip, setChip] = useState<Chip>("all");
  const [mounted, setMounted] = useState(false);

  const initialItems = useMemo(() => {
    const base: NotificationItem[] = [...SEEDED];
    if (user?.planExpiresAt) {
      const expires = new Date(user.planExpiresAt);
      const daysLeft = Math.ceil((expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0 && daysLeft <= 30) {
        base.unshift({
          id: "renewal",
          type: "important",
          title: `Subscription Renews in ${daysLeft} Day${daysLeft !== 1 ? "s" : ""}`,
          body: `Your ${planDisplayName(user.plan)} plan expires on ${expires.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}. Renew early to avoid service interruption.`,
          time: "Account",
          unread: true,
          chip: "system",
        });
      }
    }
    return base;
  }, [user]);

  const [items, setItems] = useState<NotificationItem[]>(initialItems);

  useEffect(() => {
    const unsub = onAppNotification((p) => {
      const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const time = "Just now";
      const type: NType = p.level === "error" ? "alert" : p.level === "warning" ? "important" : "standard";
      const chip: Exclude<Chip, "all"> = /receipt/i.test(p.title || "") ? "receipts" : /renew/i.test(p.title || "") ? "deadlines" : "system";
      const item: NotificationItem = { id, type, title: p.title, body: p.description ?? "", time, unread: true, chip };
      setItems((s) => [item, ...s]);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const unreadCount = items.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    if (chip === "all") return items;
    return items.filter((n) => n.chip === chip);
  }, [chip, items]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    notify.success("All read", "All notifications marked as read.");
  };

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  };

  const CHIPS: { id: Chip; label: string }[] = [
    { id: "all", label: "All" },
    { id: "deadlines", label: "Tax Deadlines" },
    { id: "receipts", label: "Receipts" },
    { id: "system", label: "System" },
  ];

  return (
    <DashboardShell
      title="Notifications"
      actions={
        <button
          type="button"
          onClick={markAllRead}
          className="px-4 py-2 rounded-lg text-sm font-bold border transition-colors hover:bg-[#fcfaf5]"
          style={{ borderColor: SB.cardBorder, color: SB.ink }}
        >
          Mark all read
        </button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-3" style={{ color: SB.ink }}>
              Notifications
              {unreadCount > 0 && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-extrabold"
                  style={{ backgroundColor: SB.yellow, color: SB.ink }}
                >
                  {unreadCount} new
                </span>
              )}
            </h2>
            <p className="text-sm mt-1" style={{ color: SB.muted }}>
              Your latest compliance activities, alerts and account updates.
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div
          className={`flex flex-wrap gap-2 pb-1 transition-all duration-500 delay-75 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip(c.id)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all border"
              style={
                chip === c.id
                  ? { backgroundColor: SB.ink, color: SB.cream, borderColor: SB.ink }
                  : { backgroundColor: SB.white, color: SB.muted, borderColor: SB.cardBorder }
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Notification cards */}
        <div className="space-y-4">
          {filtered.map((n, idx) => {
            if (n.type === "feature") {
              return (
                <div
                  key={n.id}
                  className={`relative overflow-hidden rounded-2xl p-6 flex flex-col md:flex-row items-start gap-6 transition-all duration-500 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    backgroundColor: SB.ink,
                    transitionDelay: mounted ? `${100 + idx * 60}ms` : "0ms",
                  }}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ backgroundColor: SB.mint }} />
                  <div className="relative z-10 flex-1">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-3"
                      style={{ backgroundColor: SB.yellow, color: SB.ink }}
                    >
                      {n.time}
                    </span>
                    <h3 className="text-xl font-extrabold mb-2" style={{ color: SB.cream }}>
                      {n.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "rgba(252,250,245,0.7)" }}>
                      {n.body}
                    </p>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                      style={{ backgroundColor: SB.yellow, color: SB.ink }}
                      onClick={() => notify.info("Coming soon", "E-Invoicing is now live in your dashboard!")}
                    >
                      Explore E-Invoicing →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(n.id)}
                    className="shrink-0 p-1 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: SB.cream }}
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            const iconBg =
              n.type === "important" ? SB.yellow :
              n.type === "alert" ? SB.blush : SB.mint;

            const Icon =
              n.type === "important" ? AlertTriangle :
              n.type === "alert" ? Shield : CheckCircle2;

            const iconColor =
              n.type === "important" ? "#b45309" :
              n.type === "alert" ? "#991b1b" : "#1a5c3a";

            return (
              <div
                key={n.id}
                className={`rounded-2xl border p-5 flex items-start gap-4 transition-all duration-500 cursor-pointer hover:shadow-md ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } ${n.unread ? "" : "opacity-75"}`}
                style={{
                  backgroundColor: SB.white,
                  borderColor: n.unread ? "rgba(26,51,0,0.15)" : SB.cardBorder,
                  transitionDelay: mounted ? `${100 + idx * 60}ms` : "0ms",
                }}
                onClick={() => markRead(n.id)}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm leading-snug" style={{ color: SB.ink }}>
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs" style={{ color: SB.pencil }}>
                        {n.time}
                      </span>
                      {n.unread && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: SB.ink }}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-1.5 leading-relaxed" style={{ color: SB.muted }}>
                    {n.body}
                  </p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {n.type === "important" && (
                      <>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                          style={{ backgroundColor: SB.ink, color: SB.cream }}
                          onClick={(e) => {
                            e.stopPropagation();
                            notify.info("Navigate", "Routing to your filing flow.");
                          }}
                        >
                          Take Action
                        </button>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                          style={{ borderColor: SB.cardBorder, color: SB.muted }}
                          onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    {n.type === "alert" && (
                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={{ backgroundColor: "#fecaca", color: "#991b1b" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          notify.success("Secured", "Device flagged. Security team notified.");
                        }}
                      >
                        Secure Account
                      </button>
                    )}
                    {n.type === "standard" && (
                      <button
                        type="button"
                        className="text-xs font-bold"
                        style={{ color: SB.ink }}
                        onClick={(e) => {
                          e.stopPropagation();
                          notify.info("Document", "Document viewer opening…");
                        }}
                      >
                        View Document →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div
              className="rounded-2xl border p-16 text-center"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: SB.cream }}
              >
                <Bell className="w-8 h-8" style={{ color: SB.pencil }} />
              </div>
              <p className="font-bold" style={{ color: SB.ink }}>
                All clear here
              </p>
              <p className="text-sm mt-1" style={{ color: SB.muted }}>
                No notifications in this category.
              </p>
            </div>
          )}
        </div>

        {/* Load more */}
        <div className="flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-bold transition-colors hover:bg-[#fcfaf5]"
            style={{ borderColor: SB.cardBorder, color: SB.muted }}
            onClick={() => notify.info("Up to date", "You've seen all recent notifications.")}
          >
            <RefreshCw className="w-4 h-4" />
            Load older notifications
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

export default NotificationsPage;
