import AppShell from "@/components/layout/AppShell";
import EInvoicingHero from "@/components/e-invoicing-landing/EInvoicingHero";
import EInvoicingFeatures from "@/components/e-invoicing-landing/EInvoicingFeatures";
import EInvoicingBenefits from "@/components/e-invoicing-landing/EInvoicingBenefits";
import UnifiedPricing from "@/components/sections/UnifiedPricing";
import EInvoicingFinalCta from "@/components/e-invoicing-landing/EInvoicingFinalCta";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";
import { ei } from "@/components/e-invoicing-landing/tokens";
import CodexMotion from "@/components/motion/CodexMotion";

function EInvoicingLanding() {
  return (
    <AppShell hideFooter>
      <CodexMotion>
        <main className="e-invoicing-landing overflow-x-hidden font-sans" style={{ backgroundColor: "#fcfaf5" }}>
          <EInvoicingHero />
          <EInvoicingFeatures />
          <EInvoicingBenefits />
          <UnifiedPricing theme={ei} headerTitle="Simple Pricing" headerSubtitle="Simple pricing for complex businesses." />
          <EInvoicingFinalCta />
          <FiscalFooter />
        </main>
      </CodexMotion>
    </AppShell>
  );
}

export default EInvoicingLanding;
