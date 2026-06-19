import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AppShell from "./AppShell";
import { Shield, FileText, CheckCircle2, ChevronRight } from "lucide-react";

const links = [
  { to: "/legal/terms", label: "Terms of Service", icon: FileText },
  { to: "/legal/privacy", label: "Privacy Policy", icon: Shield },
] as const;

export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <AppShell>
      <div className="bg-neutral-50/50 min-h-screen text-black py-20 font-sans">
        <div className="max-w-7xl mx-auto px-6 xl:px-12">
          
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-black text-white rounded-[2.5rem] p-12 lg:p-20 mb-12 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1e1e,black)] -z-10" />
            <div className="space-y-4 max-w-2xl">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase font-black">LEGAL HUB & REGULATORY COMPLIANCE</span>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none">{title}</h1>
              <p className="text-xs font-semibold tracking-wider text-white/55 uppercase">Last updated · {updated}</p>
            </div>
            
            <div className="shrink-0 flex flex-col gap-2.5 min-w-[220px]">
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Select Document</span>
              {links.map((l) => {
                const Icon = l.icon;
                return (
                  <Link 
                    key={l.to} 
                    to={l.to as any} 
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all group" 
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{l.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Grid Layout: Sidebar + Document Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Sidebar Table of Contents / Highlights */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest mb-6">COMPLIANCE HIGHLIGHTS</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-black">100% Tax Compliant</h4>
                      <p className="text-[10.5px] font-semibold leading-relaxed text-black/50 mt-0.5">Aligned with FCT-IRS requirements under Section 57 of the NTAA.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-black">Privacy First Architecture</h4>
                      <p className="text-[10.5px] font-semibold leading-relaxed text-black/50 mt-0.5">All client and employee data is processed locally in-browser.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-black">Audit protection</h4>
                      <p className="text-[10.5px] font-semibold leading-relaxed text-black/50 mt-0.5">Automated checks guard against filing errors or discrepancies.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-8 text-center space-y-4">
                <h4 className="text-sm font-black text-black">Have questions about compliance?</h4>
                <p className="text-[11px] leading-relaxed font-semibold text-black/50">Our team is available 24/7 to clarify policy guidelines and regulatory guidelines.</p>
                <Link to="/contact" className="inline-block text-xs font-black bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition-all shadow-md">
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Right Main Article */}
            <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
              <article className="prose prose-neutral max-w-none text-black leading-relaxed font-medium text-sm space-y-6">
                {children}
              </article>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}