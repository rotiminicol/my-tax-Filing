import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/store/adminAuth";
import { useEffect, useState } from "react";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAdminAuth((s) => s.adminUser);
  const adminAuthenticated = useAdminAuth((s) => s.adminLoggedInInMemory);
  const logOut = useAdminAuth((s) => s.logOutAdmin);
  const [verified, setVerified] = useState(false);

  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setVerified(true);
      return;
    }
    if (!user || user.role !== "admin" || !adminAuthenticated) {
      logOut();
      navigate("/admin/login");
    } else {
      setVerified(true);
    }
  }, [user, adminAuthenticated, navigate, logOut, isLoginPage]);

  if (!verified && !isLoginPage) return null;

  return <Outlet />;
}

export default AdminLayout;
