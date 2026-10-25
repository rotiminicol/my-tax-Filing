import AppShell from "@/components/layout/AppShell";
import RentReliefPageContent from "@/components/rent-relief/RentReliefPageContent";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

function RentReceiptLanding() {
  return (
    <AppShell hideFooter>
      <main className="rent-receipt-landing overflow-x-hidden font-sans">
        <RentReliefPageContent />
        <FiscalFooter />
      </main>
    </AppShell>
  );
}

export default RentReceiptLanding;
