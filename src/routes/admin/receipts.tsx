
import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { Search, Download, Filter } from "lucide-react";
import { formatNaira } from "@/lib/rr/format";
import { fetchAdminReceipts } from "@/lib/adminData";

interface Row { id: string; taxpayer: string; landlord: string; amount: number; date: string; status: "Approved" | "Pending" | "Flagged" | "Rejected"; }

function mapStatus(s: string): Row["status"] {
  if (s === "certified" || s === "approved") return "Approved";
  if (s === "draft" || s === "pending") return "Pending";
  if (s === "rejected") return "Rejected";
  return "Flagged";
}

function AdminReceipts() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [DATA, setData] = useState<Row[]>([]);

  useEffect(() => {
    void fetchAdminReceipts().then(rows => {
      setData(rows.map(r => ({
        id: r.id.slice(0, 8).toUpperCase(),
        taxpayer: r.taxpayer?.fullName ?? "—",
        landlord: r.landlord?.name ?? "—",
        amount: Number(r.taxpayer?.amount ?? 0),
        date: new Date(r.certified_date ?? r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: mapStatus(r.status),
      })));
    }).catch(() => {});
  }, []);

  const rows = DATA.filter(r =>
    (status === "All" || r.status === status) &&
    (!q || r.id.toLowerCase().includes(q.toLowerCase()) || r.taxpayer.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AdminShell title="All Receipts">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search receipt id or taxpayer name…"
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {["All","Approved","Pending","Flagged","Rejected"].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors ${status === s ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>{s}</button>
              ))}
            </div>
            <button className="h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-bold flex items-center gap-2 hover:bg-gray-50"><Filter className="w-4 h-4" /> Filters</button>
            <button className="h-11 px-4 rounded-xl bg-black text-white text-sm font-bold flex items-center gap-2 hover:bg-black/90"><Download className="w-4 h-4" /> Export</button>
          </div>
        </div>

        <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Receipt</th>
                <th className="px-6 py-4 text-left">Taxpayer / Claimant</th>
                <th className="px-6 py-4 text-left">Landlord / Agent</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4 font-black tabular-nums">{r.id}</td>
                  <td className="px-6 py-4">{r.taxpayer}</td>
                  <td className="px-6 py-4 text-gray-500">{r.landlord}</td>
                  <td className="px-6 py-4 text-right font-bold tabular-nums">{formatNaira(r.amount)}</td>
                  <td className="px-6 py-4 text-gray-500">{r.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                      r.status === "Approved" ? "bg-emerald-50 text-emerald-700"
                      : r.status === "Pending" ? "bg-amber-50 text-amber-700"
                      : r.status === "Flagged" ? "bg-orange-50 text-orange-700"
                      : "bg-red-50 text-red-700"
                    }`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col gap-3">
          {rows.map(r => (
            <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-black tabular-nums">{r.id}</p>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  r.status === "Approved" ? "bg-emerald-50 text-emerald-700"
                  : r.status === "Pending" ? "bg-amber-50 text-amber-700"
                  : r.status === "Flagged" ? "bg-orange-50 text-orange-700"
                  : "bg-red-50 text-red-700"
                }`}>{r.status}</span>
              </div>
              <p className="text-sm font-bold">{r.taxpayer}</p>
              <p className="text-xs text-gray-500">{r.landlord} · {r.date}</p>
              <p className="text-lg font-black tabular-nums mt-2">{formatNaira(r.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminReceipts;
