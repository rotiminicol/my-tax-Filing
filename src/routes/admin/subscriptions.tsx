
import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { fetchAdminSubscriptions, fetchAdminProfiles } from "@/lib/adminData";
import { formatNaira } from "@/lib/rr/format";

const MONTHLY: Record<string, number> = { free: 0, deluxe: 12500, premium: 45000 };
const ANNUAL: Record<string, number> = { free: 0, deluxe: 120000, premium: 432000 };

function AdminSubs() {
  const [subs, setSubs] = useState<Awaited<ReturnType<typeof fetchAdminSubscriptions>>>([]);
  const [profiles, setProfiles] = useState<Awaited<ReturnType<typeof fetchAdminProfiles>>>([]);

  useEffect(() => {
    void Promise.all([fetchAdminSubscriptions(), fetchAdminProfiles()])
      .then(([s, p]) => { setSubs(s); setProfiles(p); }).catch(() => {});
  }, []);

  const active = subs.filter(s => s.status === "active");
  const mrr = active.reduce((sum, s) => sum + (MONTHLY[s.plan] ?? 0), 0);
  const arr = mrr * 12;
  const paying = active.filter(s => s.plan !== "free").length;
  const total = subs.length || 1;
  const churn = `${((subs.filter(s => s.status !== "active").length / total) * 100).toFixed(1)}%`;

  const planCounts: Record<string, number> = { free: 0, deluxe: 0, premium: 0 };
  for (const s of active) planCounts[s.plan] = (planCounts[s.plan] ?? 0) + 1;

  const PLANS = [
    { name: "Free", price: "₦0", users: planCounts.free, color: "border-gray-200" },
    { name: "Deluxe", price: "₦12,500/mo", users: planCounts.deluxe, color: "border-amber-300 bg-amber-50/40" },
    { name: "Premium", price: "₦45,000/mo", users: planCounts.premium, color: "border-neutral-300 bg-neutral-50/40" },
  ];

  const profMap = new Map(profiles.map(p => [p.id, p]));
  const INVOICES = active
    .filter(s => s.plan !== "free")
    .slice(0, 8)
    .map((s, i) => {
      const cycle = s.billing_cycle === "annual" ? ANNUAL : MONTHLY;
      const p = profMap.get(s.user_id);
      return {
        id: `SUB-${s.user_id.slice(0, 6).toUpperCase()}`,
        customer: p?.business_name || p?.full_name || p?.email || "—",
        amount: cycle[s.plan] ?? 0,
        status: "Active",
        date: s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—",
        _i: i,
      };
    });

  return (
    <AdminShell title="Subscriptions">
      <div className="flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "MRR", v: formatNaira(mrr), trend: "live", up: true, icon: DollarSign },
            { l: "ARR", v: formatNaira(arr), trend: "projected", up: true, icon: TrendingUp },
            { l: "Paying Users", v: paying.toLocaleString(), trend: `${active.length} active`, up: true, icon: Users },
            { l: "Churn", v: churn, trend: "all-time", up: false, icon: TrendingDown },
          ].map(k => (
            <div key={k.l} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <k.icon className="w-5 h-5 text-gray-400" />
                <span className={`text-[10px] font-black uppercase tracking-widest ${k.up ? "text-emerald-600" : "text-red-600"}`}>{k.trend}</span>
              </div>
              <p className="text-2xl lg:text-3xl font-black tracking-tighter">{k.v}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest mb-4">Plans</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map(p => (
              <div key={p.name} className={`rounded-2xl border-2 p-6 ${p.color}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{p.name}</p>
                <p className="text-3xl font-black mt-2 tracking-tighter">{p.price}</p>
                <p className="text-sm font-bold text-gray-600 mt-4">{p.users.toLocaleString()} active users</p>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest">Recent invoices</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Invoice</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {INVOICES.map(i => (
                <tr key={`${i.id}-${i._i}`} className="hover:bg-gray-50/40">
                  <td className="px-6 py-3 font-black tabular-nums">{i.id}</td>
                  <td className="px-6 py-3">{i.customer}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-bold">{formatNaira(i.amount)}</td>
                  <td className="px-6 py-3 text-gray-500">{i.date}</td>
                  <td className="px-6 py-3">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">{i.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminSubs;
