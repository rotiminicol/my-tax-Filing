/**
 * Breadcrumb labels and routes for authenticated customer dashboard pages.
 */

export interface DashboardBreadcrumb {
  label: string;
  /** When omitted, this crumb is the current page (not linked). */
  to?: string;
}

export const DASHBOARD_HOME = "/customer-dashboard/receipts";

const dash = (label: string, to?: string): DashboardBreadcrumb => ({ label, to });

const section = (
  sectionLabel: string,
  sectionTo: string,
  pageLabel: string,
  pageTo?: string,
): DashboardBreadcrumb[] => [
  dash("Dashboard", DASHBOARD_HOME),
  dash(sectionLabel, sectionTo),
  dash(pageLabel, pageTo),
];

/** Exact pathname → trail (pathname without trailing slash). */
const ROUTE_BREADCRUMBS: Record<string, DashboardBreadcrumb[]> = {
  [DASHBOARD_HOME]: [dash("Dashboard", DASHBOARD_HOME), dash("Rent Receipt")],

  "/customer-dashboard/receipt/new": section("Rent Receipt", DASHBOARD_HOME, "New Receipt"),
  "/customer-dashboard/receipt/preview": section("Rent Receipt", DASHBOARD_HOME, "Preview Receipt"),
  "/customer-dashboard/batch": section("Rent Receipt", DASHBOARD_HOME, "Batch Upload"),

  "/customer-dashboard/taxes": [dash("Dashboard", DASHBOARD_HOME), dash("Taxes")],
  "/customer-dashboard/taxes/filing": section("Taxes", "/customer-dashboard/taxes", "Tax Filing"),
  "/customer-dashboard/taxes/paye": section("Taxes", "/customer-dashboard/taxes", "PAYE"),
  "/customer-dashboard/taxes/vat": section("Taxes", "/customer-dashboard/taxes", "VAT"),
  "/customer-dashboard/taxes/withholding": section("Taxes", "/customer-dashboard/taxes", "Withholding Tax"),

  "/customer-dashboard/documents": [dash("Dashboard", DASHBOARD_HOME), dash("Document Renewal")],
  "/customer-dashboard/documents/new": section(
    "Document Renewal",
    "/customer-dashboard/documents",
    "Add Document",
  ),
  "/customer-dashboard/documents/vin": section(
    "Document Renewal",
    "/customer-dashboard/documents",
    "Vehicle License",
  ),
  "/customer-dashboard/documents/drivers-license": section(
    "Document Renewal",
    "/customer-dashboard/documents",
    "Driver's License",
  ),

  "/customer-dashboard/invoicing/manage": [
    dash("Dashboard", DASHBOARD_HOME),
    dash("E-Invoicing", "/customer-dashboard/invoicing/manage"),
    dash("Manage Invoices"),
  ],
  "/customer-dashboard/invoicing/create": section(
    "E-Invoicing",
    "/customer-dashboard/invoicing/manage",
    "Create Invoice",
  ),
  "/customer-dashboard/invoicing/payments": section(
    "E-Invoicing",
    "/customer-dashboard/invoicing/manage",
    "Payments",
  ),
  "/customer-dashboard/invoicing/templates": section(
    "E-Invoicing",
    "/customer-dashboard/invoicing/manage",
    "Templates",
  ),

  "/customer-dashboard/support": [dash("Dashboard", DASHBOARD_HOME), dash("Help & Support")],
  "/customer-dashboard/notifications": [dash("Dashboard", DASHBOARD_HOME), dash("Notifications")],
  "/customer-dashboard/settings": [dash("Dashboard", DASHBOARD_HOME), dash("Settings")],
  "/customer-dashboard/subscription": [dash("Dashboard", DASHBOARD_HOME), dash("Subscription")],
  "/customer-dashboard/profile": [dash("Dashboard", DASHBOARD_HOME), dash("User Profile")],
};

const SEGMENT_LABELS: Record<string, string> = {
  receipts: "Rent Receipt",
  receipt: "Rent Receipt",
  batch: "Rent Receipt",
  taxes: "Taxes",
  documents: "Document Renewal",
  invoicing: "E-Invoicing",
  support: "Help & Support",
  notifications: "Notifications",
  settings: "Settings",
  subscription: "Subscription",
  profile: "User Profile",
  new: "New",
  manage: "Manage",
  create: "Create",
  preview: "Preview",
  filing: "Tax Filing",
  paye: "PAYE",
  vat: "VAT",
  withholding: "Withholding Tax",
  payments: "Payments",
  templates: "Templates",
  vin: "Vehicle License",
  "drivers-license": "Driver's License",
  passport: "International Passport",
  "tax-clearance": "Tax Clearance",
  "business-permit": "Business Permit",
};

const SECTION_HUBS: Record<string, { label: string; to: string }> = {
  receipt: { label: "Rent Receipt", to: DASHBOARD_HOME },
  receipts: { label: "Rent Receipt", to: DASHBOARD_HOME },
  batch: { label: "Rent Receipt", to: DASHBOARD_HOME },
  taxes: { label: "Taxes", to: "/customer-dashboard/taxes" },
  documents: { label: "Document Renewal", to: "/customer-dashboard/documents" },
  invoicing: { label: "E-Invoicing", to: "/customer-dashboard/invoicing/manage" },
};

function normalizePath(pathname: string): string {
  if (!pathname.startsWith("/customer-dashboard")) return pathname;
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/customer-dashboard";
}

function titleCaseSegment(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildFallbackTrail(path: string): DashboardBreadcrumb[] {
  const rest = path.replace(/^\/customer-dashboard\/?/, "").split("/").filter(Boolean);
  const trail: DashboardBreadcrumb[] = [dash("Dashboard", DASHBOARD_HOME)];

  if (rest.length === 0) {
    trail.push(dash("Rent Receipt"));
    return trail;
  }

  if (rest.length === 1) {
    const label = SEGMENT_LABELS[rest[0]] ?? titleCaseSegment(rest[0]);
    trail.push(dash(label));
    return trail;
  }

  const hub = SECTION_HUBS[rest[0]];
  if (hub) {
    trail.push(dash(hub.label, hub.to));
  }

  for (let i = 1; i < rest.length; i++) {
    const segment = rest[i];
    const label = SEGMENT_LABELS[segment] ?? titleCaseSegment(segment);
    const isLast = i === rest.length - 1;
    const pathSoFar = `/customer-dashboard/${rest.slice(0, i + 1).join("/")}`;
    trail.push(isLast ? dash(label) : dash(label, pathSoFar));
  }

  return trail;
}

/** Resolve breadcrumb trail for a dashboard pathname. */
export function getDashboardBreadcrumbs(pathname: string): DashboardBreadcrumb[] {
  const path = normalizePath(pathname);

  if (!path.startsWith("/customer-dashboard")) {
    return [];
  }

  const exact = ROUTE_BREADCRUMBS[path];
  if (exact) return exact;

  return buildFallbackTrail(path);
}
