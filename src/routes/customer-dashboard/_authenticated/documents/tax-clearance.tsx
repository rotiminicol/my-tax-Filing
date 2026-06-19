
import DashboardShell from "@/components/layout/DashboardShell";
import DocumentTypePage from "@/components/dashboard/documents/DocumentTypePage";
import { getDocumentTypeConfig } from "@/lib/documentTypes";

function TaxClearanceRoute() {
  return (
    <DashboardShell>
      <DocumentTypePage config={getDocumentTypeConfig("tax-clearance")} />
    </DashboardShell>
  );
}

export default TaxClearanceRoute;
