import {
  Briefcase,
  Car,
  Globe,
  IdCard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type DocumentType =
  | "vehicle-license"
  | "drivers-license"
  | "passport"
  | "tax-clearance"
  | "business-permit";

export interface DocumentTypeConfig {
  type: DocumentType;
  label: string;
  shortLabel: string;
  description: string;
  route: string;
  icon: LucideIcon;
  referenceLabel: string;
  referencePlaceholder: string;
  issuerLabel?: string;
  issuerPlaceholder?: string;
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    type: "vehicle-license",
    label: "Vehicle License",
    shortLabel: "Vehicle",
    description:
      "Vehicle licences and road worthiness certificates for private and commercial vehicles.",
    route: "/customer-dashboard/documents/vin",
    icon: Car,
    referenceLabel: "Plate number",
    referencePlaceholder: "e.g. ABC-123XY",
    issuerLabel: "State / LGA",
    issuerPlaceholder: "e.g. Lagos State",
  },
  {
    type: "drivers-license",
    label: "Driver's License",
    shortLabel: "Driver's License",
    description:
      "Renew your Nigerian driver's license through the Federal Road Safety Corps (FRSC).",
    route: "/customer-dashboard/documents/drivers-license",
    icon: IdCard,
    referenceLabel: "License number",
    referencePlaceholder: "e.g. NG-9023841",
    issuerLabel: "Issuing authority",
    issuerPlaceholder: "FRSC",
  },
  {
    type: "passport",
    label: "International Passport",
    shortLabel: "Passport",
    description:
      "Track Nigerian international passport expiry and renewal with the Nigeria Immigration Service (NIS).",
    route: "/customer-dashboard/documents/passport",
    icon: Globe,
    referenceLabel: "Passport number",
    referencePlaceholder: "e.g. A12345678",
    issuerLabel: "Passport type",
    issuerPlaceholder: "Standard / Official",
  },
  {
    type: "tax-clearance",
    label: "Tax Clearance Certificate",
    shortLabel: "Tax Clearance",
    description:
      "Tax Clearance Certificates from FIRS for business operations and official transactions.",
    route: "/customer-dashboard/documents/tax-clearance",
    icon: ShieldCheck,
    referenceLabel: "TIN",
    referencePlaceholder: "e.g. 12345678901",
    issuerLabel: "Tax year",
    issuerPlaceholder: "e.g. 2025",
  },
  {
    type: "business-permit",
    label: "Business Permit",
    shortLabel: "Business Permit",
    description:
      "Operational permits, CAC annual returns, and business documentation renewal.",
    route: "/customer-dashboard/documents/business-permit",
    icon: Briefcase,
    referenceLabel: "Registration / permit no.",
    referencePlaceholder: "e.g. RC129482",
    issuerLabel: "Issuing body",
    issuerPlaceholder: "e.g. CAC",
  },
];

export const SUPPORTED_DOCUMENT_TYPES = DOCUMENT_TYPES.filter((documentType) =>
  documentType.type === "vehicle-license" || documentType.type === "drivers-license",
);

export function getDocumentTypeConfig(type: DocumentType): DocumentTypeConfig {
  const found = DOCUMENT_TYPES.find((d) => d.type === type);
  if (!found) throw new Error(`Unknown document type: ${type}`);
  return found;
}

export function documentTypeFromPath(pathname: string): DocumentType | null {
  if (pathname.includes("/documents/vin")) return "vehicle-license";
  if (pathname.includes("/documents/drivers-license")) return "drivers-license";
  if (pathname.includes("/documents/passport")) return "passport";
  if (pathname.includes("/documents/tax-clearance")) return "tax-clearance";
  if (pathname.includes("/documents/business-permit")) return "business-permit";
  return null;
}
