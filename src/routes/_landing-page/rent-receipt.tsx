import AppShell from "@/components/layout/AppShell";
import RentReceiptHero from "@/components/rent-receipt-landing/RentReceiptHero";
import RentReceiptBenefits from "@/components/rent-receipt-landing/RentReceiptBenefits";
import RentReceiptHowItWorks from "@/components/rent-receipt-landing/RentReceiptHowItWorks";
import RentReceiptAudience from "@/components/rent-receipt-landing/RentReceiptAudience";
import UnifiedPricing from "@/components/sections/UnifiedPricing";
import RentReceiptFinalCta from "@/components/rent-receipt-landing/RentReceiptFinalCta";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";
import { rr } from "@/components/rent-receipt-landing/tokens";
import CodexMotion from "@/components/motion/CodexMotion";

function RentReceiptLanding() {
  return (
    <AppShell hideFooter>
      <CodexMotion>
        <div className="rent-receipt-landing overflow-x-hidden font-sans" style={{ backgroundColor: "#fcfaf5" }}>
          <RentReceiptHero />
          <RentReceiptBenefits />
          <RentReceiptHowItWorks />
          <RentReceiptAudience />
          <UnifiedPricing theme={rr} headerTitle="Pricing Plans" headerSubtitle="Choose the plan that fits your property portfolio." />
          <RentReceiptFinalCta />
          <FiscalFooter />
        </div>
      </CodexMotion>
    </AppShell>
  );
}

export default RentReceiptLanding;
