
import DashboardShell from "@/components/layout/DashboardShell";
import DocumentTypePage from "@/components/dashboard/documents/DocumentTypePage";
import { getDocumentTypeConfig } from "@/lib/documentTypes";

function PassportRoute() {
  return (
    <DashboardShell>
      <DocumentTypePage config={getDocumentTypeConfig("passport")} />
    </DashboardShell>
  );
}

export default PassportRoute;
