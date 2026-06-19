import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/fiscal-landing/ComingSoon";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "News — My Tax Filing" }, { name: "description", content: "Tax news, tips and policy updates." }] }),
  component: () => (
    <AppShell>
      <ComingSoon eyebrow="News" title="Stay in the know." blurb="Tax news, tips and policy updates from our editorial desk." />
    </AppShell>
  ),
});
