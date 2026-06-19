
import { useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { Flag, RefreshCw, Palette, AlertTriangle } from "lucide-react";
import { notify } from "@/components/Toaster";

function AdminSettings() {
  const [flags, setFlags] = useState({ batch_v2: true, ai_assist: false, audit_export: true });
  const toggle = (k: keyof typeof flags) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  return (
    <AdminShell title="Platform Settings">
      <div className="flex flex-col gap-6 max-w-3xl">
        {/* Feature flags */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Flag className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-black uppercase tracking-widest">Feature flags</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {Object.entries(flags).map(([k, v]) => (
              <div key={k} className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{k}</p>
                  <p className="text-xs text-gray-500">Toggle this capability across the platform.</p>
                </div>
                <button onClick={() => toggle(k as keyof typeof flags)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${v ? "bg-black" : "bg-gray-200"}`}>
                  <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${v ? "translate-x-5" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Data refresh */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-black uppercase tracking-widest">Reference data</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">FCT-IRS tax office directory</p>
              <p className="text-xs text-gray-500">Last synced: 18 May 2026 · 04:00 WAT</p>
            </div>
            <button onClick={() => notify.success("Refresh queued", "Tax office data will sync within the next minute.")}
              className="px-4 h-10 rounded-xl bg-black text-white text-sm font-bold hover:bg-black/90">
              Refresh now
            </button>
          </div>
        </section>

        {/* Branding */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-black uppercase tracking-widest">Branding</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Wordmark and primary brand colour applied across emails and receipts.</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black grid place-items-center text-white text-xs font-black">LOGO</div>
            <input defaultValue="#0a0a0a" className="h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-mono w-40 focus:outline-none" />
            <button className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50">Save</button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-red-50/40 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-black uppercase tracking-widest text-red-700">Danger zone</h2>
          </div>
          <p className="text-sm text-red-700/80 mb-4">Destructive operations. Double-check before running.</p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 h-10 rounded-xl bg-white border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50">Purge sandbox data</button>
            <button className="px-4 h-10 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">Rotate API keys</button>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

export default AdminSettings;
