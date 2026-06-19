import AppShell from "@/components/layout/AppShell";
import DocumentRenewalHero from "@/components/document-renewal-landing/DocumentRenewalHero";
import DocumentRenewalSupported from "@/components/document-renewal-landing/DocumentRenewalSupported";
import DocumentRenewalFeatures from "@/components/document-renewal-landing/DocumentRenewalFeatures";
import DocumentRenewalProcess from "@/components/document-renewal-landing/DocumentRenewalProcess";
import DocumentRenewalFinalCta from "@/components/document-renewal-landing/DocumentRenewalFinalCta";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";
import CodexMotion from "@/components/motion/CodexMotion";

function DocumentRenewalLanding() {
  return (
    <AppShell hideFooter>
      <CodexMotion>
        <main className="document-renewal-landing overflow-x-hidden font-sans" style={{ backgroundColor: "#fcfaf5" }}>
          <DocumentRenewalHero />
          <DocumentRenewalSupported />
          <DocumentRenewalFeatures />
          <DocumentRenewalProcess />
          <DocumentRenewalFinalCta />
          <FiscalFooter />
        </main>
      </CodexMotion>
    </AppShell>
  );
}

export default DocumentRenewalLanding;
