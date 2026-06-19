
import { useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { Search, MoreVertical, Shield, UserX, KeyRound } from "lucide-react";

interface Row { id: string; name: string; email: string; plan: "Free" | "Pro" | "Enterprise"; receipts: number; joined: string; role: "user" | "admin"; status: "active" | "suspended"; }

const SEED: Row[] = [
  { id: "u_001", name: "Adaeze Okafor", email: "adaeze@firm.com", plan: "Pro", receipts: 28, joined: "12 Jan 2026", role: "user", status: "active" },
  { id: "u_002", name: "Tunde Bakare", email: "tunde@startup.io", plan: "Free", receipts: 4, joined: "03 Feb 2026", role: "user", status: "active" },
  { id: "u_003", name: "Zainab Yusuf", email: "z.yusuf@gov.ng", plan: "Enterprise", receipts: 142, joined: "29 Nov 2025", role: "admin", status: "active" },
  { id: "u_004", name: "Chinedu Eze", email: "chinedu@law.ng", plan: "Pro", receipts: 56, joined: "18 Mar 2026", role: "user", status: "suspended" },
  { id: "u_005", name: "Funke Adebayo", email: "funke@retail.ng", plan: "Free", receipts: 1, joined: "02 May 2026", role: "user", status: "active" },
  { id: "u_006", name: "Ibrahim Musa", email: "ibrahim.m@oilco.ng", plan: "Enterprise", receipts: 233, joined: "01 Sep 2025", role: "user", status: "active" },
  { id: "u_007", name: "Ngozi Bello", email: "ngozi@consult.com", plan: "Pro", receipts: 19, joined: "11 Apr 2026", role: "user", status: "active" },
];

function AdminUsers() {
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const rows = SEED.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <AdminShell title="Users">
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span className="px-3 py-1.5 rounded-md bg-gray-100">{rows.length} of {SEED.length}</span>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Plan</th>
                <th className="px-6 py-4 text-left">Receipts</th>
                <th className="px-6 py-4 text-left">Joined</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                      r.plan === "Enterprise" ? "bg-purple-50 text-purple-700"
                      : r.plan === "Pro" ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>{r.plan}</span>
                  </td>
                  <td className="px-6 py-4 tabular-nums font-bold">{r.receipts}</td>
                  <td className="px-6 py-4 text-gray-500">{r.joined}</td>
                  <td className="px-6 py-4">
                    {r.role === "admin"
                      ? <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-red-50 text-red-700">Admin</span>
                      : <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-gray-100 text-gray-600">User</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="More">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === r.id && (
                      <div className="absolute right-4 top-full mt-1 z-10 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1 text-left">
                        <button className="w-full px-4 py-2.5 text-sm font-bold hover:bg-gray-50 flex items-center gap-2"><Shield className="w-4 h-4" /> Promote to admin</button>
                        <button className="w-full px-4 py-2.5 text-sm font-bold hover:bg-gray-50 flex items-center gap-2"><KeyRound className="w-4 h-4" /> Reset password</button>
                        <button className="w-full px-4 py-2.5 text-sm font-bold hover:bg-red-50 text-red-600 flex items-center gap-2"><UserX className="w-4 h-4" /> Suspend account</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="font-bold truncate">{r.name}</p>
                  <p className="text-xs text-gray-500 truncate">{r.email}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${r.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                  {r.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Plan</p><p className="font-bold mt-0.5">{r.plan}</p></div>
                <div><p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Receipts</p><p className="font-bold mt-0.5 tabular-nums">{r.receipts}</p></div>
                <div><p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Role</p><p className="font-bold mt-0.5">{r.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminUsers;
