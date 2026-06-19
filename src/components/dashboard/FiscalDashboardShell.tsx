import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, CircleUser, Menu, X, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import SignOutConfirmModal from "@/components/auth/SignOutConfirmModal";
import { useAuth } from "@/store/auth";
import { formatPlanSummary } from "@/lib/planConfig";
import { notify } from "@/components/Toaster";
import {
  MAIN_NAV,
  MOBILE_BOTTOM_NAV,
  SIDEBAR_ACCOUNT_NAV,
  isNavActive,
} from "./fiscalNav";
import DashboardBreadcrumbs from "./DashboardBreadcrumbs";
import type { DashboardBreadcrumb } from "@/lib/dashboardBreadcrumbs";

import { sb } from "./dashboardTokens";

interface Props {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  breadcrumbs?: DashboardBreadcrumb[];
}

export default function FiscalDashboardShell({
  children,
  actions,
  breadcrumbs,
}: Props): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const logOut = useAuth((s) => s.logOut);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    return undefined;
  }, [mobileOpen]);

  const handleLogout = () => {
    logOut();
    notify.success("Signed out", "You've been logged out.");
    navigate("/customer-dashboard/login");
  };

  const planLine = formatPlanSummary(user?.plan, user?.planBillingCycle);

  const SidebarNav = ({ collapsed }: { collapsed: boolean }) => (
    <>
      {/* Plan summary section */}
      <div
        className={`border-b mb-3 transition-all duration-300 ${collapsed ? "px-2 py-3" : "px-4 py-3"}`}
        style={{ borderColor: sb.sidebarDivider }}
      >
        {!collapsed ? (
          <>
            <h3 className="text-sm font-bold tracking-tight" style={{ color: "#fcfaf5" }}>
              Dashboard
            </h3>
            <p className="text-xs mt-1" style={{ color: "rgba(252,250,245,0.65)" }}>
              {planLine}
            </p>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(252,250,245,0.3)" }} />
          </div>
        )}
      </div>

      {/* Main navigation */}
      <div className={`flex flex-col gap-1 ${collapsed ? "px-2" : "px-3"}`}>
        {MAIN_NAV.map((item) => {
          const active = isNavActive(location.pathname, item.prefixes);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm font-semibold transition-all duration-150 ${collapsed ? "justify-center" : "justify-start"}`}
              style={{
                padding: collapsed ? "10px" : "10px 12px",
                backgroundColor: active ? sb.sidebarActive : "transparent",
                color: active ? sb.sidebarActiveText : sb.sidebarText,
                fontWeight: active ? 700 : 600,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = sb.sidebarHoverBg;
                  e.currentTarget.style.color = "#fcfaf5";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = sb.sidebarText;
                }
              }}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: "18px", height: "18px" }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom section: account actions */}
      <div className="mt-auto pt-4 border-t flex flex-col gap-1" style={{ borderColor: sb.sidebarDivider }}>
        <div className={`flex flex-col gap-1 ${collapsed ? "px-2" : "px-3"}`}>
          {SIDEBAR_ACCOUNT_NAV.map((item) => {
            if (item.type === "action") {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-lg text-sm font-semibold transition-all duration-150 ${collapsed ? "justify-center" : "justify-start"} cursor-pointer`}
                  style={{
                    padding: collapsed ? "10px" : "10px 12px",
                    color: "#fca5a5",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(252,165,165,0.10)";
                    e.currentTarget.style.color = "#fecaca";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#fca5a5";
                  }}
                >
                  <Icon style={{ width: "18px", height: "18px" }} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            }

            const Icon = item.icon;
            const active = isNavActive(location.pathname, item.prefixes ?? [item.to]);
            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg text-sm transition-all duration-150 ${collapsed ? "justify-center" : "justify-start"}`}
                style={{
                  padding: collapsed ? "10px" : "10px 12px",
                  backgroundColor: active ? sb.sidebarActive : "transparent",
                  color: active ? sb.sidebarActiveText : sb.sidebarText,
                  fontWeight: active ? 700 : 600,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = sb.sidebarHoverBg;
                    e.currentTarget.style.color = "#fcfaf5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = sb.sidebarText;
                  }
                }}
              >
                <Icon style={{ width: "18px", height: "18px" }} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: sb.contentBg, color: sb.forestInk }}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className="hidden md:flex fixed left-0 top-0 bottom-0 flex-col z-50 transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: sb.sidebarBg,
            width: sidebarCollapsed ? "72px" : "256px",
            boxShadow: "2px 0 12px rgba(26,51,0,0.12)",
          }}
        >
          {/* Sidebar header */}
          <div
            className={`h-[68px] flex items-center border-b transition-all duration-300 ${sidebarCollapsed ? "justify-center px-2" : "justify-between px-5"}`}
            style={{ borderColor: sb.sidebarDivider }}
          >
            {!sidebarCollapsed && (
              <div style={{ color: "#fcfaf5" }}>
                <FiscalBrand size={40} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg transition-all duration-150 hover:bg-white/10 focus:outline-none"
              style={{ color: "#fcfaf5" }}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto py-4">
            <SidebarNav collapsed={sidebarCollapsed} />
          </div>
        </aside>

        {/* Main content area */}
        <div
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? "72px" : "256px") }}
        >
          {/* Top header — cream paper */}
          <header
            className="fixed top-0 right-0 h-[68px] flex items-center border-b z-40 transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: sb.headerBg,
              borderColor: sb.headerBorder,
              left: isMobile ? 0 : (sidebarCollapsed ? "72px" : "256px"),
            }}
          >
            <div className="flex justify-between items-center w-full px-6 md:px-10 gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/5"
                  style={{ color: sb.forestInk }}
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="relative flex-1 max-w-md hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: sb.pencilGray }}
                  />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border outline-none transition-all focus:ring-2 placeholder:text-sm"
                    style={{
                      backgroundColor: sb.whisperGray,
                      borderColor: "rgba(26,51,0,0.12)",
                      color: sb.forestInk,
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  to="/customer-dashboard/notifications"
                  className="p-2 rounded-full transition-all duration-150 hover:bg-black/5"
                  style={{ color: sb.forestInk }}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </Link>
                <Link
                  to="/customer-dashboard/profile"
                  className="p-2 rounded-full transition-all duration-150 hover:bg-black/5"
                  style={{ color: sb.forestInk }}
                  aria-label="Account"
                >
                  <CircleUser className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 pt-[68px]">
            {actions && (
              <div
                className="hidden md:flex px-4 py-2 border-b gap-2 overflow-x-auto"
                style={{ borderColor: sb.headerBorder, backgroundColor: sb.cream }}
              >
                {actions}
              </div>
            )}
            {actions && (
              <div
                className="md:hidden px-4 py-2 border-b flex gap-2 overflow-x-auto"
                style={{ borderColor: sb.headerBorder, backgroundColor: sb.cream }}
              >
                {actions}
              </div>
            )}
            <main
              className="px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-8"
              style={{ backgroundColor: sb.contentBg }}
            >
              <div className="mx-auto w-full max-w-7xl space-y-4">
                <DashboardBreadcrumbs items={breadcrumbs} />
                {children}
              </div>
            </main>
          </div>

          {/* Footer */}
          <footer
            className="relative w-full shrink-0 border-t"
            style={{ backgroundColor: sb.cream, borderColor: sb.headerBorder }}
          >
            <div
              className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-6 md:px-10 mx-auto"
              style={{ maxWidth: sb.maxWidth, color: sb.forestInk }}
            >
              <div className="text-center md:text-left">
                <div className="text-sm font-bold tracking-tight" style={{ color: sb.forestInk }}>My Tax Filing</div>
                <p className="text-xs mt-0.5" style={{ color: sb.pencilGray }}>
                  © {new Date().getFullYear()} My Tax Filing. Licensed Nigerian Fintech Provider.
                </p>
              </div>
              <nav className="flex flex-wrap justify-center gap-6 text-xs">
                {["Privacy Policy", "Terms of Service", "Contact Us"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="transition-opacity hover:opacity-100 underline-offset-2 hover:underline"
                    style={{ color: sb.pencilGray }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile sidebar (overlay) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[272px] flex flex-col shadow-2xl animate-in slide-in-from-left duration-250"
            style={{ backgroundColor: sb.sidebarBg }}
          >
            <div
              className="flex justify-between items-center p-5 border-b"
              style={{ borderColor: sb.sidebarDivider }}
            >
              <div style={{ color: "#fcfaf5" }}>
                <FiscalBrand />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" style={{ color: "#fcfaf5" }} />
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto py-4">
              <SidebarNav collapsed={false} />
            </div>
          </aside>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 border-t"
        style={{
          backgroundColor: sb.cream,
          borderColor: sb.headerBorder,
        }}
      >
        {MOBILE_BOTTOM_NAV.map((item) => {
          const active = isNavActive(location.pathname, item.prefixes);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95"
              style={{ color: active ? sb.forestInk : sb.pencilGray }}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <SignOutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
