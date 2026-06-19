import AppShell from "@/components/layout/AppShell";
import TaxesHero from "@/components/taxes-landing/TaxesHero";
import TaxesFeatures from "@/components/taxes-landing/TaxesFeatures";
import TaxesValueSection from "@/components/taxes-landing/TaxesValueSection";
import UnifiedPricing from "@/components/sections/UnifiedPricing";
import TaxesFinalCta from "@/components/taxes-landing/TaxesFinalCta";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";
import { tax } from "@/components/taxes-landing/tokens";
import CodexMotion from "@/components/motion/CodexMotion";

function TaxesLanding() {
  return (
    <AppShell hideFooter>
      <CodexMotion>
        <div className="taxes-landing overflow-x-hidden font-sans" style={{ backgroundColor: "#fcfaf5" }}>
          <TaxesHero />
          <TaxesFeatures />
          <TaxesValueSection />
          <UnifiedPricing theme={tax} headerTitle="Pricing" headerSubtitle="Choose Your Path to Compliance" />
          <TaxesFinalCta />
          <FiscalFooter />
        </div>
      </CodexMotion>
    </AppShell>
  );
}

export default TaxesLanding;
