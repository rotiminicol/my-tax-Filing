import type { LucideIcon } from "lucide-react";
import { fiscal } from "@/components/fiscal-landing/tokens";

interface Props {
  icon: LucideIcon;
  children: React.ReactNode;
  id?: string;
}

export default function SectionHeading({ icon: Icon, children, id }: Props) {
  return (
    <h2
      id={id}
      className="text-3xl font-bold mb-6 flex items-center gap-3 scroll-mt-28"
      style={{ color: fiscal.primary }}
    >
      <span
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: fiscal.primaryContainer }}
      >
        <Icon className="w-5 h-5" style={{ color: fiscal.onPrimaryContainer }} />
      </span>
      {children}
    </h2>
  );
}
