import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/e-invoicing")({
  head: () => ({ meta: [{ title: "E-Invoicing — My Tax Filing" }, { name: "description", content: "Issue compliant invoices and accept payments." }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="E-Invoicing" title="Invoices that comply." blurb="Issue compliant invoices and accept payments without juggling tools." />
    </AppShell>
  ),
});
