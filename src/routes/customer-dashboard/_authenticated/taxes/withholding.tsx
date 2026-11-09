import DashboardShell from "@/components/layout/DashboardShell";
import WithholdingPage from "@/components/dashboard/taxes/WithholdingPage";
import UpgradeGate from "@/components/subscription/UpgradeGate";

export default function TaxesWithholdingPage() {
  return (
    <DashboardShell>
      <UpgradeGate feature="withholding-tax">
        <WithholdingPage />
      </UpgradeGate>
    </DashboardShell>
  );
}
