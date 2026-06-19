
import AdminShell from "@/components/layout/AdminShell";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

const PLANS = [
  { name: "Free", price: "₦0", users: 7240, color: "border-gray-200" },
  { name: "Pro", price: "₦4,500/mo", users: 4120, color: "border-amber-300 bg-amber-50/40" },
  { name: "Enterprise", price: "Custom", users: 487, color: "border-neutral-300 bg-neutral-50/40" },
];

const INVOICES = Array.from({ length: 8 }, (_, i) => ({
  id: `INV-${20240 - i}`,
  customer: ["Acme Ltd","Lekki Estates","MyRentReceipt Group","Gov Office FCT","Maitama Plc"][i % 5],
  amount: 45000 + i * 12000,
  status: i % 4 === 0 ? "Failed" : "Paid",
  date: `${i + 1} May 2026`,
}));

function AdminSubs() {
  return (
    <AdminShell title="Subscriptions">
      <div className="flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "MRR", v: "₦18.4M", trend: "+12.1%", up: true, icon: DollarSign },
            { l: "ARR", v: "₦220.8M", trend: "+18.4%", up: true, icon: TrendingUp },
            { l: "Paying Users", v: "4,607", trend: "+6.2%", up: true, icon: Users },
            { l: "Churn", v: "2.3%", trend: "-0.4pp", up: false, icon: TrendingDown },
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
                <tr key={i.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-3 font-black tabular-nums">{i.id}</td>
                  <td className="px-6 py-3">{i.customer}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-bold">₦{i.amount.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-500">{i.date}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${i.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{i.status}</span>
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
