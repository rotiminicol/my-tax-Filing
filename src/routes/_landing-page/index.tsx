import AppShell from "@/components/layout/AppShell";
import HeroSection from "@/components/fiscal-landing/HeroSection";
import ToolsSection from "@/components/fiscal-landing/ToolsSection";
import StepsSection from "@/components/fiscal-landing/StepsSection";
import UnifiedPricing from "@/components/sections/UnifiedPricing";
import FinalCtaSection from "@/components/fiscal-landing/FinalCtaSection";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

export default function Home() {
  return (
    <AppShell hideFooter>
      <main
        className="overflow-x-hidden font-sans"
        style={{ backgroundColor: "#fcfaf5" }}
      >
        <HeroSection />
        <ToolsSection />
        <StepsSection />
        <UnifiedPricing
          headerTitle="Pricing Plans"
          headerSubtitle="Plans designed to scale with your financial journey."
        />
        <FinalCtaSection />
        <FiscalFooter />
      </main>
    </AppShell>
  );
}
