
import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { Activity, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { fetchAuditLog, fetchAdminProfiles } from "@/lib/adminData";

interface Entry { id: string; at: string; actor: string; action: string; resource: string; severity: "info" | "warning" | "success" | "error"; }

function severityFor(action: string): Entry["severity"] {
  if (action.includes("delete") || action.includes("suspend")) return "warning";
  if (action.includes("promote") || action.includes("approved")) return "success";
  if (action.includes("fail") || action.includes("error")) return "error";
  return "info";
}

const iconFor = (s: Entry["severity"]) => ({
  info: <Info className="w-4 h-4 text-slate-500" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  error: <AlertTriangle className="w-4 h-4 text-red-500" />,
}[s]);

function AdminAudit() {
  const [LOG, setLog] = useState<Entry[]>([]);
  useEffect(() => {
    void Promise.all([fetchAuditLog(), fetchAdminProfiles()]).then(([rows, profiles]) => {
      const byId = new Map(profiles.map(p => [p.id, p.email]));
      setLog(rows.map(r => ({
        id: r.id,
        at: new Date(r.created_at).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        actor: byId.get(r.admin_id) ?? r.admin_id.slice(0, 8),
        action: r.action.replace(/_/g, " "),
        resource: r.target_user_id ? `users/${r.target_user_id.slice(0, 8)}` : "system",
        severity: severityFor(r.action),
      })));
    }).catch(() => {});
  }, []);
  return (
    <AdminShell title="Audit Log">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-black uppercase tracking-widest">System Activity · today</h2>
          </div>
          <span className="text-xs font-bold text-gray-400">{LOG.length} entries</span>
        </div>
        <ul className="divide-y divide-gray-50">
          {LOG.map(e => (
            <li key={e.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/40">
              <div className="mt-0.5">{iconFor(e.severity)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{e.action}</p>
                <p className="text-xs text-gray-500 truncate">
                  <span className="font-mono">{e.resource}</span> · by <span className="font-bold">{e.actor}</span>
                </p>
              </div>
              <span className="text-xs font-bold tabular-nums text-gray-400 shrink-0">{e.at}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}

export default AdminAudit;
