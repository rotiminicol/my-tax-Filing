
import DashboardShell from "@/components/layout/DashboardShell";
import DocumentTypePage from "@/components/dashboard/documents/DocumentTypePage";
import { getDocumentTypeConfig } from "@/lib/documentTypes";

function VehicleLicenseRoute() {
  return (
    <DashboardShell>
      <DocumentTypePage config={getDocumentTypeConfig("vehicle-license")} />
    </DashboardShell>
  );
}

export default VehicleLicenseRoute;
