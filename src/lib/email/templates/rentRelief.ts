import { renderBaseEmailLayout } from "./base";

function renderRentDetailsBox(params: {
  receiptId: string;
  annualRent: string;
  allowanceClaimed: string;
  propertyAddress: string;
  landlordName: string;
}): string {
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.14); border-radius: 12px; margin: 20px 0; overflow: hidden;">
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Receipt ID</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-family: monospace; font-weight: 700; color: #18623f;">${params.receiptId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Annual Rental Amount</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 700; color: #111827;">${params.annualRent}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Allowance Claimed</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 800; color: #18623f;">${params.allowanceClaimed}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Property Address</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #374151;">${params.propertyAddress}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; font-size: 13px; color: #6b7280;">Landlord / Agent</td>
        <td align="right" style="padding: 12px 18px; font-size: 13px; font-weight: 600; color: #374151;">${params.landlordName}</td>
      </tr>
    </table>
  `;
}

export function renderRentReliefCreated(vars: {
  fullName?: string;
  receiptId: string;
  annualRent: string;
  allowanceClaimed: string;
  propertyAddress: string;
  landlordName: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your official <strong>Rent Relief Tax Receipt</strong> has been successfully generated on the TaxFilling portal.</p>
    <p>This document includes your cryptographic security stamp and QR verification code, ready for inclusion in your annual tax return.</p>
    
    ${renderRentDetailsBox(vars)}
  `;

  return {
    subject: `Rent Receipt Generated: ${vars.receiptId} — Ready for Relief Claim`,
    html: renderBaseEmailLayout({
      title: "Rent Relief Receipt Created",
      preheader: `Rent receipt ${vars.receiptId} has been created and verified.`,
      badge: "Receipt Generated",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Download Receipt PDF",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipts",
    }),
  };
}

export function renderRentReliefSubmitted(vars: {
  fullName?: string;
  receiptId: string;
  taxAuthority?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const authority = vars.taxAuthority || "FCT Internal Revenue Service (FCT-IRS)";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your Rent Relief claim associated with Receipt <strong>${vars.receiptId}</strong> has been officially submitted to <strong>${authority}</strong> for assessment.</p>
    <p>Our automated compliance engine will monitor the review process and update your claim status as soon as the revenue service confirms your filing.</p>
  `;

  return {
    subject: `Rent Relief Claim Submitted to ${authority}`,
    html: renderBaseEmailLayout({
      title: "Claim Submitted Successfully",
      preheader: `Claim ${vars.receiptId} submitted to ${authority}.`,
      badge: "Under Review",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Track Claim Status",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes",
    }),
  };
}

export function renderRentReliefStatusUpdated(vars: {
  fullName?: string;
  receiptId: string;
  newStatus: string;
  statusNote?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>The status of your Rent Relief claim (Receipt ID: <strong>${vars.receiptId}</strong>) has been updated to:</p>
    
    <div style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.2); border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <span style="display: inline-block; background-color: #d5f5c2; color: #18623f; font-weight: 800; font-size: 13px; text-transform: uppercase; padding: 4px 10px; border-radius: 6px;">
        ${vars.newStatus}
      </span>
      ${vars.statusNote ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #4b5563;">${vars.statusNote}</p>` : ""}
    </div>
  `;

  return {
    subject: `Status Update: Rent Relief Claim #${vars.receiptId} is now ${vars.newStatus}`,
    html: renderBaseEmailLayout({
      title: "Claim Status Updated",
      preheader: `Your claim ${vars.receiptId} has been updated to ${vars.newStatus}.`,
      badge: "Status Changed",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "View Claim Details",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipts",
    }),
  };
}

export function renderRentReliefApproved(vars: {
  fullName?: string;
  receiptId: string;
  approvedAmount: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Great news! Your Rent Relief application for Receipt <strong>${vars.receiptId}</strong> has been <strong>approved</strong> by the tax authority.</p>
    <p>An approved relief amount of <strong>${vars.approvedAmount}</strong> has been credited against your assessed personal income tax obligation.</p>
    <p>Your official Tax Clearance Certificate / Assessment Notice is available for download in your dashboard.</p>
  `;

  return {
    subject: `Approved: Rent Relief Claim #${vars.receiptId} Approved 🎉`,
    html: renderBaseEmailLayout({
      title: "Rent Relief Claim Approved",
      preheader: `Your relief claim for ${vars.approvedAmount} has been approved.`,
      badge: "Approved",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Download Assessment Notice",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/taxes/history",
    }),
  };
}

export function renderRentReliefRejected(vars: {
  fullName?: string;
  receiptId: string;
  reason: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>The tax authority was unable to approve your Rent Relief claim (Receipt ID: <strong>${vars.receiptId}</strong>) at this time.</p>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b;"><strong>Reason Given:</strong> ${vars.reason}</p>
    </div>

    <p>You can correct these details and re-submit your claim directly through the TaxFilling portal without paying additional fees.</p>
  `;

  return {
    subject: `Action Required: Rent Relief Claim #${vars.receiptId} Needs Correction`,
    html: renderBaseEmailLayout({
      title: "Correction Required for Claim",
      preheader: `Your claim ${vars.receiptId} requires attention.`,
      badge: "Correction Needed",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Review & Correct Claim",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipts",
    }),
  };
}

export function renderRentReliefActionRequired(vars: {
  fullName?: string;
  receiptId: string;
  missingDocuments: string[];
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const docsList = vars.missingDocuments.map((doc) => `<li>${doc}</li>`).join("");
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Additional documentation is needed to finalize your Rent Relief claim (Receipt ID: <strong>${vars.receiptId}</strong>):</p>
    
    <div style="background-color: #fcfaf5; border: 1px solid #ffe95c; border-radius: 8px; padding: 14px 20px; margin: 18px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #18623f;">Required Documents:</p>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px;">${docsList}</ul>
    </div>

    <p>Please upload these items to avoid delays in your assessment.</p>
  `;

  return {
    subject: `Documents Required: Rent Relief Claim #${vars.receiptId}`,
    html: renderBaseEmailLayout({
      title: "Additional Documents Needed",
      preheader: `Upload missing documents for claim ${vars.receiptId}.`,
      badge: "Action Required",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Upload Supporting Documents",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipts",
    }),
  };
}

export function renderRentReliefReminder(vars: { fullName?: string; deadlineDate: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>This is a reminder that the annual Personal Income Tax filing deadline is approaching on <strong>${vars.deadlineDate}</strong>.</p>
    <p>Ensure you have generated your compliant rent receipts and submitted your housing allowance relief claims before the deadline to maximize your legitimate deductions.</p>
  `;

  return {
    subject: `Reminder: Submit Your Annual Rent Relief Claims Before ${vars.deadlineDate}`,
    html: renderBaseEmailLayout({
      title: "Rent Relief Filing Reminder",
      preheader: `File your rent relief before the ${vars.deadlineDate} deadline.`,
      badge: "Filing Deadline",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Generate Rent Receipt",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipt/new",
    }),
  };
}
