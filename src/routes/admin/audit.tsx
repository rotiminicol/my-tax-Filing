
import AdminShell from "@/components/layout/AdminShell";
import { Activity, AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface Entry { id: string; at: string; actor: string; action: string; resource: string; severity: "info" | "warning" | "success" | "error"; }

const LOG: Entry[] = [
  { id: "1", at: "10:42:18", actor: "system", action: "Tax-office data refresh completed", resource: "tax_offices/fct", severity: "success" },
  { id: "2", at: "10:31:02", actor: "admin@myrentreceipt.com", action: "Suspended user account", resource: "users/u_004", severity: "warning" },
  { id: "3", at: "09:58:44", actor: "zainab@gov.ng", action: "Generated receipt", resource: "receipts/RR-8421", severity: "info" },
  { id: "4", at: "09:30:11", actor: "system", action: "Failed webhook delivery to Slack", resource: "integrations/slack", severity: "error" },
  { id: "5", at: "09:12:50", actor: "admin@myrentreceipt.com", action: "Updated feature flag", resource: "flags/batch_v2", severity: "info" },
  { id: "6", at: "08:45:09", actor: "system", action: "Nightly backup completed", resource: "db/main", severity: "success" },
  { id: "7", at: "08:21:33", actor: "tunde@startup.io", action: "Password reset requested", resource: "auth/reset", severity: "info" },
  { id: "8", at: "07:55:01", actor: "system", action: "Rate limit triggered", resource: "api/public/receipts", severity: "warning" },
];

const iconFor = (s: Entry["severity"]) => ({
  info: <Info className="w-4 h-4 text-slate-500" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  error: <AlertTriangle className="w-4 h-4 text-red-500" />,
}[s]);

function AdminAudit() {
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
