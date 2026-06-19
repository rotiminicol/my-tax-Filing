import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  History,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ShieldAlert,
  ArrowLeftRight,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import SignOutConfirmModal from "@/components/auth/SignOutConfirmModal";
import { useAdminAuth } from "@/store/adminAuth";
import { notify } from "@/components/Toaster";

interface Props {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

const navItems: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/receipts", label: "Receipts", icon: FileText },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/audit", label: "Audit Log", icon: History },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminShell({ children, title, actions }: Props) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useAdminAuth((s) => s.adminUser);
  const logOut = useAdminAuth((s) => s.logOutAdmin);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
    return undefined;
  }, [isMobileOpen]);

  const handleLogout = () => {
    logOut();
    notify.success("Signed out", "You've been logged out.");
    navigate("/admin/login");
  };

  const SidebarBody = (
    <>
      <div className="mb-10 w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={40} className="brightness-0 invert" to="" />
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
          <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">Admin Console</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5 w-full px-3 overflow-y-auto hide-scrollbar pb-6">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to as any}
              className={`w-full rounded-xl flex items-center px-4 py-3 gap-4 transition-all duration-200 ${
                isActive
                  ? "bg-neutral-800 text-white border border-neutral-700"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        <div className="h-px bg-white/10 my-4 w-full" />

        <button
          onClick={() => {
            logOut();
            notify.success("Admin Session Ended", "Please sign in with a standard customer account.");
            navigate("/customer-dashboard/login");
          }}
          className="w-full rounded-xl flex items-center px-4 py-3 gap-4 text-white/50 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
        >
          <ArrowLeftRight className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold tracking-tight">Customer View</span>
        </button>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="rounded-xl flex items-center px-4 py-3 gap-4 text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold tracking-tight">Sign Out</span>
        </button>
      </nav>
    </>
  );

  return (
    <div className="h-screen bg-[#fafafa] flex overflow-hidden font-['Outfit']">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex bg-[#0a0a0a] flex-col items-stretch py-6 w-72 shrink-0 border-r border-neutral-900">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[80] transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-y-0 left-0 w-[82%] max-w-sm bg-[#0a0a0a] flex flex-col py-6 shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {SidebarBody}
        </aside>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <header className="h-16 lg:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-10 shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden -ml-2 p-2 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground px-2 py-1 bg-secondary border border-border rounded-md">Admin</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-[#111] tracking-tighter italic uppercase truncate">
              {title || "Admin"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {actions && <div className="hidden sm:flex items-center gap-2">{actions}</div>}
            <button className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="hidden sm:block h-8 w-px bg-gray-200" />
            <Link to="/admin/settings" className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-neutral-100 shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "Admin")}&background=000000&color=ffffff&bold=true`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right hidden md:block min-w-0">
                <p className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors truncate max-w-[160px]">
                  {user?.fullName?.split(" ")[0]}
                </p>
              </div>
              <ChevronRight className="hidden md:block w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-all rotate-90" />
            </Link>
          </div>
        </header>

        {actions && (
          <div className="sm:hidden px-4 py-3 border-b border-gray-200 flex items-center gap-2 overflow-x-auto hide-scrollbar bg-white">
            {actions}
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 hide-scrollbar">
          <div className="max-w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>

      <SignOutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}