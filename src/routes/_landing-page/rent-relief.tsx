import AppShell from "@/components/layout/AppShell";
import RentReliefPageContent from "@/components/rent-relief/RentReliefPageContent";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

export default function RentReliefLanding() {
  return (
    <AppShell hideFooter>
      <main className="overflow-x-hidden font-sans">
        <RentReliefPageContent />
        <FiscalFooter />
      </main>
    </AppShell>
  );
}
