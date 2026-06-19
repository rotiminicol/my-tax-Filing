import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — My Tax Filing" }, { name: "description", content: "Talk to our team." }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="Contact" title="We're here to help." blurb="Reach our team for sales, support or partnership questions." />
    </AppShell>
  ),
});
