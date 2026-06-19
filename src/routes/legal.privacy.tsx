import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({ meta: [{ title: "Privacy — My Tax Filing" }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="Legal" title="Privacy policy." blurb="How we collect, use and protect your data." />
    </AppShell>
  ),
});
