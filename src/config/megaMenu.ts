export const megaMenuData: Record<string, any> = {
  "/taxes": {
    columns: [
      {
        items: [
          { label: "File online →", to: "/taxes#online", bold: true },
          { label: "File with a pro →", to: "/taxes#pro", bold: true },
          { label: "Download software →", to: "/taxes#software", bold: true },
          { label: "Small business taxes →", to: "/taxes#small-business", bold: true },
        ],
      },
      {
        title: "More tax services",
        items: [
          { label: "Second Look® Review", to: "/taxes#more-services" },
          { label: "Peace of Mind®", to: "/taxes#more-services" },
          { label: "Tax Identity Shield®", to: "/taxes#more-services" },
          { label: "Tax Notice Services", to: "/taxes#more-services" },
          { label: "ITIN application", to: "/taxes#more-services" },
        ],
      },
      {
        title: "Your tax appointment",
        items: [
          { label: "Tax appointment prep", to: "/taxes#appointment" },
          { label: "Manage appointment", to: "/taxes#appointment" },
          { label: "Español", to: "/taxes#appointment" },
        ],
      },
      {
        title: "International",
        items: [
          { label: "Expat taxes", to: "/taxes#international" },
          { label: "International offices", to: "/taxes#international" },
        ],
      },
    ],
    cards: [
      {
        title: "File with a tax pro →",
        description: "Get expert help from a tax pro online, or visit an office.",
        bgClass: "bg-primary text-primary-foreground",
        to: "/taxes#pro",
      },
      {
        title: "File online →",
        description: "Use step-by-step instructions to file your own taxes at your own pace.",
        bgClass: "bg-[#F3F2EA] text-foreground",
        to: "/taxes#online",
      },
    ],
  },
  "/rent-receipt": {
    columns: [
      {
        items: [
          { label: "Generate Receipt →", to: "/rent-receipt", bold: true },
          { label: "Batch Import →", to: "/rent-receipt", bold: true },
          { label: "Receipt History →", to: "/rent-receipt", bold: true },
        ],
      },
      {
        title: "Features",
        items: [
          { label: "FCT-IRS Compliant", to: "/rent-receipt" },
          { label: "Instant Generation", to: "/rent-receipt" },
          { label: "Secure Storage", to: "/rent-receipt" },
        ],
      },
    ],
    cards: [
      {
        title: "Generate Rent Receipt →",
        description: "Create compliant rent allowance receipts in minutes.",
        bgClass: "bg-primary text-primary-foreground",
        to: "/rent-receipt",
      },
    ],
  },
  "/document-renewal": {
    columns: [
      {
        items: [
          { label: "Renew Documents →", to: "/document-renewal", bold: true },
          { label: "Track Status →", to: "/document-renewal", bold: true },
        ],
      },
      {
        title: "Documents",
        items: [
          { label: "Tax Clearance", to: "/document-renewal" },
          { label: "Certificates", to: "/document-renewal" },
          { label: "Licenses", to: "/document-renewal" },
        ],
      },
    ],
    cards: [
      {
        title: "Document Renewal →",
        description: "Renew your important documents efficiently.",
        bgClass: "bg-primary text-primary-foreground",
        to: "/document-renewal",
      },
    ],
  },
  "/e-invoicing": {
    columns: [
      {
        items: [
          { label: "Create Invoice →", to: "/e-invoicing", bold: true },
          { label: "Manage Invoices →", to: "/e-invoicing", bold: true },
          { label: "Track Payments →", to: "/e-invoicing", bold: true },
        ],
      },
      {
        title: "Features",
        items: [
          { label: "Professional Templates", to: "/e-invoicing" },
          { label: "Payment Tracking", to: "/e-invoicing" },
          { label: "Automated Reminders", to: "/e-invoicing" },
        ],
      },
    ],
    cards: [
      {
        title: "E-invoicing →",
        description: "Create and manage electronic invoices efficiently.",
        bgClass: "bg-primary text-primary-foreground",
        to: "/e-invoicing",
      },
    ],
  },
};
