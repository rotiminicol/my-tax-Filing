import AppShell from "@/components/layout/AppShell";
import EInvoicingPageContent from "@/components/e-invoicing-landing/EInvoicingPageContent";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

function EInvoicingLanding() {
  return (
    <AppShell hideFooter>
      <main className="e-invoicing-landing overflow-x-hidden font-sans">
        <EInvoicingPageContent />
        <FiscalFooter />
      </main>
    </AppShell>
  );
}

export default EInvoicingLanding;
