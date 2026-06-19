import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import HeroSection from "@/components/fiscal-landing/HeroSection";
import ToolsSection from "@/components/fiscal-landing/ToolsSection";
import StepsSection from "@/components/fiscal-landing/StepsSection";
import UnifiedPricing from "@/components/sections/UnifiedPricing";
import FinalCtaSection from "@/components/fiscal-landing/FinalCtaSection";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Tax Filing — Compliance, simplified" },
      { name: "description", content: "File taxes, issue e-invoices, generate rent receipts and renew documents from one elegant workspace." },
      { property: "og:title", content: "My Tax Filing" },
      { property: "og:description", content: "The modern compliance portal for individuals, landlords and businesses." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AppShell hideFooter>
      <main className="overflow-x-hidden font-sans" style={{ backgroundColor: "#fcfaf5" }}>
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
