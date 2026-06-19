
import DashboardShell from "@/components/layout/DashboardShell";
import DocumentTypePage from "@/components/dashboard/documents/DocumentTypePage";
import { getDocumentTypeConfig } from "@/lib/documentTypes";

function BusinessPermitRoute() {
  return (
    <DashboardShell>
      <DocumentTypePage config={getDocumentTypeConfig("business-permit")} />
    </DashboardShell>
  );
}

export default BusinessPermitRoute;
