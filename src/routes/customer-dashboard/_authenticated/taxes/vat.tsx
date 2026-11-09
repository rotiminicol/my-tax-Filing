import DashboardShell from "@/components/layout/DashboardShell";
import VATPage from "@/components/dashboard/taxes/VATPage";
import UpgradeGate from "@/components/subscription/UpgradeGate";

export default function TaxesVATPage() {
  return (
    <DashboardShell>
      <UpgradeGate feature="vat-filing">
        <VATPage />
      </UpgradeGate>
    </DashboardShell>
  );
}
