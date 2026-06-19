import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/rent-receipt")({
  head: () => ({ meta: [{ title: "Rent Receipts — My Tax Filing" }, { name: "description", content: "Generate and share rent receipts in seconds." }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="Rent Receipts" title="Receipts your tenants love." blurb="Generate, sign and share rent receipts your accountants will thank you for." />
    </AppShell>
  ),
});
