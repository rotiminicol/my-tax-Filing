import {
  LayoutDashboard,
  Building2,
  Calculator,
  RefreshCw,
  ReceiptText,
  Settings,
  HelpCircle,
  Bell,
  CreditCard,
  CircleUser,
  LogOut,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface FiscalNavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  prefixes: string[];
}

export const MAIN_NAV: FiscalNavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/customer-dashboard",
    icon: LayoutDashboard,
    prefixes: ["/customer-dashboard"],
  },
  {
    id: "receipts",
    label: "Rent Receipt",
    to: "/customer-dashboard/receipts",
    icon: Building2,
    prefixes: [
      "/customer-dashboard/receipts",
      "/customer-dashboard/receipt",
      "/customer-dashboard/batch",
    ],
  },
  {
    id: "taxes",
    label: "Taxes",
    to: "/customer-dashboard/taxes",
    icon: Calculator,
    prefixes: ["/customer-dashboard/taxes"],
  },
  {
    id: "documents",
    label: "Document Renewal",
    to: "/customer-dashboard/documents",
    icon: RefreshCw,
    prefixes: ["/customer-dashboard/documents"],
  },
  {
    id: "invoicing",
    label: "E-Invoicing",
    to: "/customer-dashboard/invoicing/manage",
    icon: ReceiptText,
    prefixes: ["/customer-dashboard/invoicing"],
  },
];

export type SidebarNavItem =
  | {
      type: "link";
      to: string;
      label: string;
      icon: LucideIcon;
      prefixes?: string[];
    }
  | {
      type: "action";
      id: "sign-out";
      label: string;
      icon: LucideIcon;
    };

export const SIDEBAR_ACCOUNT_NAV: SidebarNavItem[] = [
  {
    type: "link",
    to: "/customer-dashboard/support",
    label: "Help & Support",
    icon: HelpCircle,
    prefixes: ["/customer-dashboard/support"],
  },
  {
    type: "link",
    to: "/customer-dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    prefixes: ["/customer-dashboard/notifications"],
  },
  {
    type: "link",
    to: "/customer-dashboard/email-previews",
    label: "Email System",
    icon: Mail,
    prefixes: ["/customer-dashboard/email-previews"],
  },
  {
    type: "link",
    to: "/customer-dashboard/settings",
    label: "Settings",
    icon: Settings,
    prefixes: ["/customer-dashboard/settings"],
  },
  {
    type: "link",
    to: "/customer-dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
    prefixes: ["/customer-dashboard/subscription"],
  },
  {
    type: "link",
    to: "/customer-dashboard/profile",
    label: "User Profile",
    icon: CircleUser,
    prefixes: ["/customer-dashboard/profile"],
  },
  {
    type: "action",
    id: "sign-out",
    label: "Sign Out",
    icon: LogOut,
  },
];

/** @deprecated Use SIDEBAR_ACCOUNT_NAV */
export const SIDEBAR_FOOTER_NAV = SIDEBAR_ACCOUNT_NAV.filter(
  (item): item is Extract<SidebarNavItem, { type: "link" }> => item.type === "link",
);

export const MOBILE_BOTTOM_NAV = [
  {
    to: "/customer-dashboard/receipts",
    label: "Receipts",
    icon: Building2,
    prefixes: [
      "/customer-dashboard/receipts",
      "/customer-dashboard/receipt",
      "/customer-dashboard/batch",
    ],
  },
  {
    to: "/customer-dashboard/taxes",
    label: "Taxes",
    icon: Calculator,
    prefixes: ["/customer-dashboard/taxes"],
  },
  {
    to: "/customer-dashboard/documents",
    label: "Renewals",
    icon: RefreshCw,
    prefixes: ["/customer-dashboard/documents"],
  },
  {
    to: "/customer-dashboard/settings",
    label: "Settings",
    icon: Settings,
    prefixes: ["/customer-dashboard/settings", "/customer-dashboard/profile"],
  },
];

export function isNavActive(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) =>
    p === "/customer-dashboard" ? pathname === p : pathname === p || pathname.startsWith(`${p}/`),
  );
}
