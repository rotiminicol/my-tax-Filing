import { fiscal } from "@/components/fiscal-landing/tokens";
import { scrollToSection } from "@/components/fiscal-landing/hooks/useScrollSpy";

export interface TocItem {
  id: string;
  label: string;
}

interface Props {
  title?: string;
  items: TocItem[];
  activeId: string;
  footer?: React.ReactNode;
}

export default function LegalToc({ title = "Contents", items, activeId, footer }: Props) {
  return (
    <div className="sticky top-28 space-y-4">
      <h3 className="text-2xl font-semibold mb-6" style={{ color: fiscal.primary }}>
        {title}
      </h3>
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="text-left text-sm font-medium py-2 border-l-2 pl-4 rounded-r-md transition-all"
              style={{
                borderColor: active ? fiscal.primary : "transparent",
                color: active ? fiscal.primary : fiscal.onSurfaceVariant,
                backgroundColor: active ? "rgba(0, 53, 39, 0.05)" : "transparent",
                fontWeight: active ? 700 : 500,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      {footer}
    </div>
  );
}
