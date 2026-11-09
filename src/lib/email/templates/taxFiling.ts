import { renderBaseEmailLayout } from "./base";

function renderTaxFilingBox(params: {
  filingType: string;
  taxYear: string;
  authority: string;
  referenceNumber?: string;
  status?: string;
}): string {
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.14); border-radius: 12px; margin: 20px 0; overflow: hidden;">
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Filing Category</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 800; color: #18623f;">${params.filingType}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Assessment Year</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 700; color: #111827;">${params.taxYear}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Revenue Authority</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 600; color: #374151;">${params.authority}</td>
      </tr>
      ${
        params.referenceNumber
          ? `
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Tracking Ref</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-family: monospace; font-weight: 700; color: #18623f;">${params.referenceNumber}</td>
      </tr>`
          : ""
      }
      ${
        params.status
          ? `
      <tr>
        <td style="padding: 12px 18px; font-size: 13px; color: #6b7280;">Status</td>
        <td align="right" style="padding: 12px 18px; font-weight: 800; color: #18623f; text-transform: uppercase;">${params.status}</td>
      </tr>`
          : ""
      }
    </table>
  `;
}

export function renderTaxFilingStarted(vars: {
  fullName?: string;
  filingType: string;
  taxYear: string;
  authority: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>You have started a new <strong>${vars.filingType}</strong> draft for tax year <strong>${vars.taxYear}</strong>.</p>
    
    ${renderTaxFilingBox(vars)}

    <p>Your inputs have been safely saved. You can pause anytime and return later to upload supporting documentation and submit.</p>
  `;

  return {
    subject: `Tax Filing Started: ${vars.filingType} (${vars.taxYear})`,
    html: renderBaseEmailLayout({
      title: "Tax Filing Draft Created",
      preheader: `You've started filing your ${vars.filingType} for ${vars.taxYear}.`,
      badge: "Draft Started",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Continue Filing",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes/filing",
    }),
  };
}

export function renderTaxFilingSubmitted(vars: {
  fullName?: string;
  filingType: string;
  taxYear: string;
  authority: string;
  referenceNumber: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your <strong>${vars.filingType}</strong> has been successfully submitted to <strong>${vars.authority}</strong>.</p>
    
    ${renderTaxFilingBox({ ...vars, status: "Submitted / Pending Assessment" })}

    <p>The tax office will review your declarations. We will notify you immediately once an assessment notice or clearance certificate is generated.</p>
  `;

  return {
    subject: `Submission Confirmation: ${vars.filingType} Filed (#${vars.referenceNumber})`,
    html: renderBaseEmailLayout({
      title: "Filing Submitted Successfully",
      preheader: `Filing ${vars.referenceNumber} submitted to ${vars.authority}.`,
      badge: "Submitted",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Track Assessment Status",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes/history",
    }),
  };
}

export function renderTaxFilingCompleted(vars: {
  fullName?: string;
  filingType: string;
  taxYear: string;
  authority: string;
  referenceNumber: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Congratulations! Your <strong>${vars.filingType}</strong> for tax year <strong>${vars.taxYear}</strong> has been fully processed and approved by <strong>${vars.authority}</strong>.</p>
    
    ${renderTaxFilingBox({ ...vars, status: "Completed & Verified" })}

    <p>Your official Tax Clearance Certificate and assessment acknowledgement are now available for download.</p>
  `;

  return {
    subject: `Filing Completed: ${vars.filingType} (${vars.taxYear}) Approved 🎉`,
    html: renderBaseEmailLayout({
      title: "Tax Filing Verified & Completed",
      preheader: `Your ${vars.filingType} filing for ${vars.taxYear} is complete.`,
      badge: "Completed",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Download Clearance Documents",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes/history",
    }),
  };
}

export function renderTaxFilingCorrectionRequired(vars: {
  fullName?: string;
  filingType: string;
  taxYear: string;
  reason: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>The revenue service has flagged items requiring clarification or correction for your <strong>${vars.filingType}</strong> (${vars.taxYear}):</p>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b;"><strong>Correction Notes:</strong> ${vars.reason}</p>
    </div>

    <p>Please update the requested details in your dashboard so we can re-file on your behalf promptly.</p>
  `;

  return {
    subject: `Correction Required: Action Needed on Your ${vars.filingType} Filing`,
    html: renderBaseEmailLayout({
      title: "Filing Correction Required",
      preheader: `Update requested on your ${vars.filingType} filing.`,
      badge: "Action Required",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Update & Resubmit Filing",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes/filing",
    }),
  };
}

export function renderComplianceDocUploaded(vars: {
  fullName?: string;
  documentType: string;
  documentNumber?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your <strong>${vars.documentType}</strong> ${vars.documentNumber ? `(#${vars.documentNumber})` : ""} has been securely uploaded and archived in your encrypted compliance vault.</p>
    <p>Our automated compliance system will monitor expiration dates and alert you in advance of required renewals.</p>
  `;

  return {
    subject: `Document Secured: ${vars.documentType} Uploaded`,
    html: renderBaseEmailLayout({
      title: "Document Stored in Compliance Vault",
      preheader: `Your ${vars.documentType} has been archived safely.`,
      badge: "Document Secured",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "View Documents Vault",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/documents",
    }),
  };
}

export function renderComplianceDocExpiring(vars: {
  fullName?: string;
  documentType: string;
  documentNumber?: string;
  expiryDate: string;
  daysRemaining: number;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>This is a renewal notification that your <strong>${vars.documentType}</strong> ${vars.documentNumber ? `(#${vars.documentNumber})` : ""} will expire in <strong>${vars.daysRemaining} days</strong> on <strong>${vars.expiryDate}</strong>.</p>
    <p>Operating with expired regulatory documents can lead to penalties from law enforcement or tax authorities. You can initiate a hassle-free renewal directly through TaxFilling:</p>
  `;

  return {
    subject: `Urgent: Your ${vars.documentType} Expires in ${vars.daysRemaining} Days`,
    html: renderBaseEmailLayout({
      title: "Regulatory Document Renewal Due",
      preheader: `Your ${vars.documentType} expires on ${vars.expiryDate}.`,
      badge: "Renewal Due",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Renew Document Now",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/documents",
    }),
  };
}

export function renderTaxDeadlineReminder(vars: {
  fullName?: string;
  deadlineName: string;
  dueDate: string;
  description: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>This is an automated statutory tax compliance reminder from TaxFilling:</p>
    
    <div style="background-color: #fcfaf5; border: 2px solid #ffe95c; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 6px 0; color: #18623f; font-size: 16px;">${vars.deadlineName}</h3>
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #dc2626; font-weight: 700;">Statutory Due Date: ${vars.dueDate}</p>
      <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">${vars.description}</p>
    </div>

    <p>Avoid last-minute penalties and interest surcharges by submitting your returns early.</p>
  `;

  return {
    subject: `Compliance Alert: ${vars.deadlineName} Due on ${vars.dueDate} ⏰`,
    html: renderBaseEmailLayout({
      title: "Upcoming Tax Statutory Deadline",
      preheader: `Reminder: ${vars.deadlineName} is due on ${vars.dueDate}.`,
      badge: "Deadline Alert",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Prepare Return Now",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes/deadlines",
    }),
  };
}
