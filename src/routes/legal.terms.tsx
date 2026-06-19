import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({ meta: [{ title: "Terms — My Tax Filing" }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="Legal" title="Terms of service." blurb="The legal terms for using My Tax Filing." />
    </AppShell>
  ),
});
