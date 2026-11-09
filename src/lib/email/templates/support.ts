import { renderBaseEmailLayout } from "./base";

export function renderSupportTicketReceived(vars: {
  fullName?: string;
  ticketId: string;
  subject: string;
  message: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We have received your support inquiry regarding <strong>"${vars.subject}"</strong>.</p>
    <p>Your ticket reference number is <strong>#${vars.ticketId}</strong>. Our tax advisory and technical support team typically responds within 2–4 business hours (or within 1 hour for Deluxe and Premium subscribers).</p>

    <div style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.15); border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #18623f; text-transform: uppercase;">Your Message:</p>
      <p style="margin: 0; font-size: 13px; color: #4b5563; font-style: italic; line-height: 1.6;">"${vars.message}"</p>
    </div>

    <p style="font-size: 13px; color: #6b7280;">You can reply directly to this email to add more information or attachments to your inquiry.</p>
  `;

  return {
    subject: `Support Ticket Received: #${vars.ticketId} — ${vars.subject}`,
    html: renderBaseEmailLayout({
      title: "Support Request Acknowledged",
      preheader: `Ticket #${vars.ticketId} received. Our support team is reviewing your inquiry.`,
      badge: "Support Ticket",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "View Support Desk",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/support",
    }),
  };
}

export function renderSupportTicketReply(vars: {
  fullName?: string;
  ticketId: string;
  subject: string;
  agentName: string;
  replyMessage: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p><strong>${vars.agentName}</strong> from TaxFilling Support has replied to your inquiry (Ticket <strong>#${vars.ticketId}</strong>):</p>

    <div style="background-color: #f0fdf4; border-left: 4px solid #18623f; border-radius: 8px; padding: 18px 22px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #18623f; text-transform: uppercase;">Response from ${vars.agentName}:</p>
      <div style="margin: 0; font-size: 14px; color: #1f2937; line-height: 1.65;">${vars.replyMessage}</div>
    </div>

    <p style="font-size: 13px; color: #6b7280;">Need more help? Simply reply directly to this email to keep the conversation going.</p>
  `;

  return {
    subject: `Response to Ticket #${vars.ticketId}: ${vars.subject}`,
    html: renderBaseEmailLayout({
      title: "New Support Message",
      preheader: `${vars.agentName} replied to your support request.`,
      badge: "Support Reply",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Reply to Ticket",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/support",
    }),
  };
}

export function renderSupportTicketResolved(vars: {
  fullName?: string;
  ticketId: string;
  subject: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your support inquiry regarding <strong>"${vars.subject}"</strong> (Ticket <strong>#${vars.ticketId}</strong>) has been marked as <strong>resolved</strong>.</p>
    <p>If you have any further questions or if this issue was not fully solved to your satisfaction, simply reply to this email to reopen the inquiry.</p>
  `;

  return {
    subject: `Support Ticket Resolved: #${vars.ticketId} — ${vars.subject}`,
    html: renderBaseEmailLayout({
      title: "Inquiry Resolved",
      preheader: `Ticket #${vars.ticketId} has been closed.`,
      badge: "Resolved",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Open Support Portal",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/support",
    }),
  };
}

export function renderBatchReceiptsProcessed(vars: {
  fullName?: string;
  batchId: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your bulk batch receipt generation import (Batch ID: <strong>#${vars.batchId}</strong>) has finished processing.</p>
    
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.14); border-radius: 12px; margin: 20px 0;">
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Total Uploaded</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: bold;">${vars.totalRecords} records</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #166534;">Successful Receipts</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 800; color: #166534;">${vars.successfulRecords} generated</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; font-size: 13px; color: #991b1b;">Failed / Validation Errors</td>
        <td align="right" style="padding: 12px 18px; font-weight: bold; color: #991b1b;">${vars.failedRecords}</td>
      </tr>
    </table>

    <p>You can download the full batch ZIP archive and error report from your Batch operations workspace.</p>
  `;

  return {
    subject: `Batch Processing Complete: ${vars.successfulRecords}/${vars.totalRecords} Receipts Generated`,
    html: renderBaseEmailLayout({
      title: "Batch Receipts Generated",
      preheader: `Batch #${vars.batchId}: ${vars.successfulRecords} receipts created.`,
      badge: "Batch Complete",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Download Batch Results",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/batch",
    }),
  };
}
