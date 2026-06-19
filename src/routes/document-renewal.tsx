import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/document-renewal")({
  head: () => ({ meta: [{ title: "Document Renewal — My Tax Filing" }, { name: "description", content: "VIN, driver's license and more — never miss a renewal." }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="Document Renewal" title="Never miss a renewal." blurb="VIN, driver's license and other official documents tracked in one place." />
    </AppShell>
  ),
});
