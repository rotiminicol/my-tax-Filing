
import DashboardShell from "@/components/layout/DashboardShell";
import DocumentTypePage from "@/components/dashboard/documents/DocumentTypePage";
import { getDocumentTypeConfig } from "@/lib/documentTypes";

function DriversLicenseRoute() {
  return (
    <DashboardShell>
      <DocumentTypePage config={getDocumentTypeConfig("drivers-license")} />
    </DashboardShell>
  );
}

export default DriversLicenseRoute;
