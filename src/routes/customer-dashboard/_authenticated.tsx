import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useEffect, useState } from "react";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const logOut = useAuth((s) => s.logOut);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "user") {
      logOut();
      navigate("/customer-dashboard/login");
    } else if (!user.emailVerified) {
      navigate("/customer-dashboard/verify-email");
    } else if (!user.onboarded) {
      navigate("/customer-dashboard/onboarding");
    } else {
      setVerified(true);
    }
  }, [user, loading, navigate, logOut]);

  if (!verified) return null;

  return <Outlet />;
}

export default AuthenticatedLayout;
