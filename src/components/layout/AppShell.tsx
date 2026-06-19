import { useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FiscalNav from "@/components/fiscal-landing/FiscalNav";
import MobileTopBar from "./MobileTopBar";
import MobileNav from "./MobileNav";
import MobileFooter from "./MobileFooter";
import Footer from "./Footer";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";

interface AppShellProps {
  children: ReactNode;
  requireAuth?: boolean;
  hideFooter?: boolean;
}

export default function AppShell({
  children,
  requireAuth = false,
  hideFooter = false,
}: AppShellProps) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (requireAuth && !user) {
      notify.error("Sign in required", "Please log in to access this page.");
      navigate(`/customer-dashboard/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [requireAuth, user, navigate, location.pathname, location.search]);

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Authenticating</p>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <FiscalNav />
      <MobileTopBar />
      <main className="flex-1 pb-32 md:pb-0">{children}</main>
      {!hideFooter && !user && <Footer />}
      <MobileNav />
    </div>
  );
}
