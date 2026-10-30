import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, FileText, Plus, Search } from "lucide-react";
import { formatNaira } from "@/lib/rr/format";
import { TAX_CATEGORY_LABELS, effectiveFilingStatus, type TaxCategory } from "@/lib/taxes";
import { useTaxesStore } from "@/store/taxes";
import { TaxCategoryIcon, TaxStatusBadge, glassCard } from "./taxShared";

const SB = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

export default function TaxHistoryPage() {
  const [search, setSearch] = useState("");
  const filings = useTaxesStore((s) => s.filings);
  const vatReturns = useTaxesStore((s) => s.vatReturns);
  const syncStatuses = useTaxesStore((s) => s.syncStatuses);

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  const historyRows = useMemo(() => {
    const allItems = [
      ...filings.map((f) => ({
        id: f.id,
        category: f.category as TaxCategory,
        title: f.title,
        period: f.period,
        amount: f.amount,
        authority: f.authority,
        status: effectiveFilingStatus(f.status, f.dueDate),
        source: "filing" as const,
        sourceId: f.id,
        dueDate: f.dueDate,
      })),
      ...vatReturns.map((v) => ({
        id: v.id,
        category: "vat" as const,
        title: TAX_CATEGORY_LABELS.vat,
        period: v.period,
        amount: v.payable,
        authority: "FIRS" as const,
        status: effectiveFilingStatus(v.status, v.dueDate),
        source: "vat" as const,
        sourceId: v.id,
        dueDate: v.dueDate,
      })),
    ].sort((a, b) => b.period.localeCompare(a.period));

    return allItems;
  }, [filings, vatReturns]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return historyRows;
    return historyRows.filter(
      (r) =>
        TAX_CATEGORY_LABELS[r.category].toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.authority.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q),
    );
  }, [historyRows, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={glassCard}>
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: SB.forestInk, fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif" }}
        >
          Tax History
        </h1>
        <p className="text-base" style={{ color: SB.pencilGray }}>
          View all your tax filings and VAT returns in one place.
        </p>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder }}
      >
        <div
          className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderColor: SB.cardBorder }}
        >
          <h3 className="text-xl font-bold" style={{ color: SB.forestInk }}>
            All Records
          </h3>
          <div className="relative flex-1 md:flex-none">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: SB.pencilGray }}
            />
            <input
              type="text"
              placeholder="Search filings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64 border outline-none focus:ring-2"
              style={{ backgroundColor: SB.whisperGray, borderColor: SB.cardBorder }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold mb-2" style={{ color: SB.forestInk }}>
              No tax records found
            </p>
            <p className="text-sm mb-4" style={{ color: SB.pencilGray }}>
              {search ? "Try a different search term." : "Create a filing or VAT return to build your history."}
            </p>
            {!search && (
              <Link
                to="/customer-dashboard/taxes/filing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm"
                style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
              >
                <Plus className="w-4 h-4" />
                New filing
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead
                className="border-b"
                style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
              >
                <tr>
                  {["Tax Type", "Period", "Amount", "Authority", "Status", "Due Date", ""].map((h) => (
                    <th
                      key={h || "actions"}
                      className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${h === "Status" ? "text-center" : ""} ${!h ? "w-12" : ""}`}
                      style={{ color: SB.pencilGray }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={`${row.source}-${row.id}`}
                    className="border-b hover:bg-[#fcfaf5] transition-colors"
                    style={{ borderColor: SB.cardBorder }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <TaxCategoryIcon category={row.category} />
                        <span className="font-bold text-sm" style={{ color: SB.forestInk }}>{row.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: SB.forestInk }}>{row.period}</td>
                    <td className="px-6 py-4 font-bold font-mono text-sm" style={{ color: SB.forestInk }}>{formatNaira(row.amount)}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: SB.pencilGray }}>{row.authority}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <TaxStatusBadge status={row.status} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: SB.forestInk }}>
                      {new Date(row.dueDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={row.source === "vat" ? "/customer-dashboard/taxes/vat" : "/customer-dashboard/taxes/filing"}
                        className="p-1 inline-flex hover:opacity-60 transition-opacity"
                        style={{ color: SB.pencilGray }}
                        aria-label="View"
                      >
                        {row.status === "pending" || row.status === "overdue" ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
