import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/taxes")({
  head: () => ({ meta: [{ title: "Taxes — My Tax Filing" }, { name: "description", content: "PAYE, VAT and withholding tax filing made simple." }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="Taxes" title="Tax filing, refined." blurb="PAYE, VAT and withholding tax — calculated, validated and filed in minutes." />
    </AppShell>
  ),
});
