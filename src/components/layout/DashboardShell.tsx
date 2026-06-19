import type { ReactNode } from "react";
import FiscalDashboardShell from "@/components/dashboard/FiscalDashboardShell";
import type { DashboardBreadcrumb } from "@/lib/dashboardBreadcrumbs";

interface Props {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  breadcrumbs?: DashboardBreadcrumb[];
}

/** Authenticated customer dashboard layout (Fiscal Sovereign / My Tax Filing). */
export default function DashboardShell({
  children,
  title,
  actions,
  breadcrumbs,
}: Props): React.ReactElement {
  return (
    <FiscalDashboardShell title={title} actions={actions} breadcrumbs={breadcrumbs}>
      {children}
    </FiscalDashboardShell>
  );
}
