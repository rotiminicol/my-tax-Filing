import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  getDashboardBreadcrumbs,
  type DashboardBreadcrumb,
} from "@/lib/dashboardBreadcrumbs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  items?: DashboardBreadcrumb[];
  className?: string;
}

export default function DashboardBreadcrumbs({ items, className }: Props) {
  const { pathname } = useLocation();
  const crumbs = items ?? getDashboardBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex-wrap gap-y-1 text-xs sm:text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isFirst = index === 0;
          const linked = Boolean(crumb.to) && !isLast;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(26,51,0,0.25)" }} />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {linked ? (
                  <Link
                    to={crumb.to!}
                    className="inline-flex items-center gap-1 font-medium transition-opacity hover:opacity-70"
                    style={{ color: "#b6b6b6" }}
                  >
                    {isFirst && <Home className="w-3.5 h-3.5 shrink-0" aria-hidden />}
                    <span className={isFirst ? "hidden sm:inline" : undefined}>{crumb.label}</span>
                    {isFirst && <span className="sr-only sm:hidden">{crumb.label}</span>}
                  </Link>
                ) : (
                  <BreadcrumbPage
                    className="font-semibold truncate max-w-[min(100%,280px)] sm:max-w-none"
                    style={{ color: "#18623f" }}
                  >
                    {isFirst && crumbs.length === 1 ? (
                      <span className="inline-flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        {crumb.label}
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
