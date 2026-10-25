import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon, Settings } from "lucide-react";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import SignOutConfirmModal from "@/components/auth/SignOutConfirmModal";
import { useAuth } from "@/store/auth";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { notify } from "@/components/Toaster";

const navLinks = [
  { to: "/rent-relief", label: "For individuals" },
  { to: "/e-invoicing", label: "For businesses" },
  { to: "/contact", label: "Contact" },
] as const;

export default function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useAuth((s) => s.user);
  const logOut = useAuth((s) => s.logOut);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logOut();
    close();
    notify.success("Signed out", "You've been logged out.");
    navigate("/customer-dashboard/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <>
      <header
        className="md:hidden sticky top-0 z-50 w-full shadow-sm border-b"
        style={{ backgroundColor: fiscal.surface, borderColor: `${fiscal.outlineVariant}4D` }}
      >
        <div className="h-16 px-4 flex items-center justify-between max-w-[1280px] mx-auto">
          <FiscalBrand />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="h-10 w-10 grid place-items-center rounded-lg border active:scale-95 transition-transform"
            style={{ borderColor: fiscal.outlineVariant, color: fiscal.primary }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={close}
          />
          <div
            className="absolute right-0 top-0 h-full w-[min(100%,320px)] shadow-2xl flex flex-col"
            style={{ backgroundColor: fiscal.surface }}
          >
            <div
              className="h-16 px-4 flex items-center justify-between border-b"
              style={{ borderColor: fiscal.outlineVariant }}
            >
              <FiscalBrand />
              <button type="button" onClick={close} aria-label="Close menu" className="p-2">
                <X className="h-5 w-5" style={{ color: fiscal.primary }} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => {
                    close();
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }}
                  className="block px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#eff4ff] transition-colors"
                  style={{ color: fiscal.primary }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t space-y-2" style={{ borderColor: fiscal.outlineVariant }}>
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: fiscal.primary }}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: fiscal.onSurface }}>
                      {user.fullName}
                    </span>
                  </div>
                  <Link
                    to="/customer-dashboard/receipts"
                    onClick={close}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#eff4ff]"
                    style={{ color: fiscal.primary }}
                  >
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/customer-dashboard/settings"
                    onClick={close}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#eff4ff]"
                    style={{ color: fiscal.primary }}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/customer-dashboard/login"
                    onClick={close}
                    className="block w-full text-center py-3 rounded-lg text-sm font-medium border"
                    style={{ borderColor: fiscal.primary, color: fiscal.primary }}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/customer-dashboard/signup"
                    onClick={close}
                    className="block w-full text-center py-3 rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: fiscal.primary }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <SignOutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
