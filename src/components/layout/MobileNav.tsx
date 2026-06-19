import { Link, useLocation } from "react-router-dom";
import { Home, FilePlus2, Files, Layers } from "lucide-react";
import { useAuth } from "@/store/auth";

const tabs = [
  { to: "/customer-dashboard/receipts", label: "Home", Icon: Home },
  { to: "/customer-dashboard/receipt/new", label: "New", Icon: FilePlus2 },
  { to: "/customer-dashboard/receipts", label: "History", Icon: Files },
  { to: "/customer-dashboard/batch", label: "Batch", Icon: Layers },
] as const;

export default function MobileNav() {
  const user = useAuth((s) => s.user);
  const { pathname } = useLocation();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-6 inset-x-4 z-40 h-20 backdrop-blur-xl bg-background/80 border border-border shadow-2xl rounded-2xl overflow-hidden">
      <ul className="grid grid-cols-4 h-full">
        {tabs.map(({ to, label, Icon }) => {
          const isActive = pathname === to || pathname.startsWith(to);
          return (
            <li key={`${to}-${label}`} className="relative flex">
              <Link
                to={to}
                className={`flex-1 flex flex-col items-center justify-center gap-2 transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${isActive ? "scale-110" : ""}`}>
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] leading-none">{label}</span>
                {isActive && (
                  <span className="absolute top-0 inset-x-0 h-1 bg-primary rounded-b" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
