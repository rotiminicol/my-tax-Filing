import AppShell from "@/components/layout/AppShell";
import LandingHero from "@/components/fiscal-landing/LandingHero";
import ChoosePathSection from "@/components/fiscal-landing/ChoosePathSection";
import ForIndividualsSection from "@/components/fiscal-landing/ForIndividualsSection";
import ForBusinessesSection from "@/components/fiscal-landing/ForBusinessesSection";
import LandingContactSection from "@/components/fiscal-landing/LandingContactSection";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

export default function Home() {
  return (
    <AppShell hideFooter>
      <main
        className="overflow-x-hidden font-sans"
        style={{ backgroundColor: "#fcfaf5" }}
      >
        <LandingHero />
        <ChoosePathSection />
        <ForIndividualsSection />
        <ForBusinessesSection />
        <LandingContactSection />
        <FiscalFooter />
      </main>
    </AppShell>
  );
}
