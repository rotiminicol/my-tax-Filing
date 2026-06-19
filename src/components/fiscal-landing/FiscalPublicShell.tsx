import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";
import { fiscal } from "@/components/fiscal-landing/tokens";
import CodexMotion from "@/components/motion/CodexMotion";

interface Props {
  children: ReactNode;
}

/** Public marketing / legal pages: fiscal nav + content + fiscal footer. */
export default function FiscalPublicShell({ children }: Props) {
  return (
    <AppShell hideFooter>
      <div
        className="min-h-screen flex flex-col font-sans overflow-x-hidden pt-8 md:pt-14"
        style={{ backgroundColor: fiscal.surface, color: fiscal.onSurface }}
      >
        <CodexMotion>
          <div className="flex-1">{children}</div>
        </CodexMotion>
        <FiscalFooter />
      </div>
    </AppShell>
  );
}
