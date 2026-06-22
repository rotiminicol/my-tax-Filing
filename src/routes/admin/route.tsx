import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/store/adminAuth";
import { useEffect } from "react";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAdminAuth((s) => s.adminUser);
  const loading = useAdminAuth((s) => s.loading);
  const adminAuthenticated = useAdminAuth((s) => s.adminLoggedInInMemory);

  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage || loading) return;
    if (!user || !adminAuthenticated) {
      navigate("/admin/login");
    }
  }, [user, adminAuthenticated, loading, navigate, isLoginPage]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-sm font-bold tracking-wider uppercase text-gray-400">
          Verifying session…
        </div>
      </div>
    );
  }
  if (!isLoginPage && (!user || !adminAuthenticated)) return null;

  return <Outlet />;
}

export default AdminLayout;
