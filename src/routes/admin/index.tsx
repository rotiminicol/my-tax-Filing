
import AdminShell from "@/components/layout/AdminShell";
import { Users, FileText, DollarSign, Activity, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

const KPIS = [
  { label: "Total Users", value: "12,847", delta: "+8.2%", icon: Users, accent: "bg-blue-50 text-blue-600" },
  { label: "Receipts This Month", value: "3,612", delta: "+24.6%", icon: FileText, accent: "bg-emerald-50 text-emerald-600" },
  { label: "Monthly Revenue", value: "₦18.4M", delta: "+12.1%", icon: DollarSign, accent: "bg-amber-50 text-amber-600" },
  { label: "Open Tickets", value: "23", delta: "-4", icon: AlertCircle, accent: "bg-red-50 text-red-600" },
];

const RECENT_USERS = [
  { name: "Adaeze Okafor", email: "adaeze@firm.com", plan: "Pro", joined: "2 min ago" },
  { name: "Tunde Bakare", email: "tunde@startup.io", plan: "Free", joined: "14 min ago" },
  { name: "Zainab Yusuf", email: "z.yusuf@gov.ng", plan: "Enterprise", joined: "1 hr ago" },
  { name: "Chinedu Eze", email: "chinedu@law.ng", plan: "Pro", joined: "3 hrs ago" },
  { name: "Funke Adebayo", email: "funke@retail.ng", plan: "Free", joined: "5 hrs ago" },
];

const RECENT_RECEIPTS = [
  { id: "RR-8421", tenant: "Adaeze O.", amount: "₦2,400,000", status: "Approved" },
  { id: "RR-8420", tenant: "Tunde B.", amount: "₦1,800,000", status: "Pending" },
  { id: "RR-8419", tenant: "Zainab Y.", amount: "₦4,500,000", status: "Approved" },
  { id: "RR-8418", tenant: "Chinedu E.", amount: "₦3,200,000", status: "Flagged" },
];

function AdminOverview() {
  return (
    <AdminShell title="Overview">
      <div className="flex flex-col gap-8 lg:gap-10">
        {/* KPIs */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {KPIS.map((k) => (
            <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.accent}`}>
                  <k.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {k.delta}
                </span>
              </div>
              <p className="text-2xl lg:text-3xl font-black text-[#111] tracking-tighter">{k.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">{k.label}</p>
            </div>
          ))}
        </section>

        {/* System health */}
        <section className="bg-[#0d0d0d] text-white rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">All systems operational</p>
              <p className="text-lg font-black mt-1">API · Workers · Database · Storage</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div><p className="text-2xl font-black tabular-nums">99.98%</p><p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Uptime</p></div>
            <div><p className="text-2xl font-black tabular-nums">142ms</p><p className="text-[10px] font-bold uppercase tracking-widest text-white/40">p95 Latency</p></div>
            <div><p className="text-2xl font-black tabular-nums">0</p><p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Incidents</p></div>
          </div>
        </section>

        {/* Two-up panels */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Recent users */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest">Recent signups</h2>
              <span className="text-xs font-bold text-gray-400">Last 24h</span>
            </div>
            <ul className="divide-y divide-gray-50">
              {RECENT_USERS.map((u) => (
                <li key={u.email} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                      u.plan === "Enterprise" ? "bg-purple-50 text-purple-700"
                      : u.plan === "Pro" ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>{u.plan}</span>
                    <span className="text-xs text-gray-400 font-medium">{u.joined}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent receipts */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest">Recent receipts</h2>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <ul className="divide-y divide-gray-50">
              {RECENT_RECEIPTS.map((r) => (
                <li key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold tabular-nums">{r.id}</p>
                    <p className="text-xs text-gray-500">{r.tenant}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black tabular-nums">{r.amount}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                      r.status === "Approved" ? "bg-emerald-50 text-emerald-700"
                      : r.status === "Pending" ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                    }`}>{r.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

export default AdminOverview;
