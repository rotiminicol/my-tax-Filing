import { renderBaseEmailLayout } from "./base";

function renderInvoiceSummaryBox(params: {
  invoiceNumber: string;
  clientName: string;
  amount: string;
  dueDate: string;
  description?: string;
}): string {
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.14); border-radius: 12px; margin: 20px 0; overflow: hidden;">
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Invoice Number</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-family: monospace; font-weight: 700; color: #18623f;">${params.invoiceNumber}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Billed To</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-weight: 600; color: #111827;">${params.clientName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 13px; color: #6b7280;">Total Amount Due</td>
        <td align="right" style="padding: 12px 18px; border-bottom: 1px solid rgba(24,98,63,0.08); font-size: 18px; font-weight: 900; color: #18623f;">${params.amount}</td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; font-size: 13px; color: #6b7280;">Due Date</td>
        <td align="right" style="padding: 12px 18px; font-weight: 600; color: #dc2626;">${params.dueDate}</td>
      </tr>
      ${
        params.description
          ? `
      <tr>
        <td colspan="2" style="padding: 12px 18px; border-top: 1px solid rgba(24,98,63,0.08); font-size: 12px; color: #4b5563; background-color: #f7f9f6;">
          <strong>Description:</strong> ${params.description}
        </td>
      </tr>`
          : ""
      }
    </table>
  `;
}

export function renderInvoiceCreatedMerchant(vars: {
  merchantName?: string;
  invoiceNumber: string;
  clientName: string;
  amount: string;
  dueDate: string;
}): { subject: string; html: string } {
  const name = vars.merchantName || "Merchant";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Invoice <strong>${vars.invoiceNumber}</strong> has been created and saved to your TaxFilling e-invoicing register.</p>
    
    ${renderInvoiceSummaryBox(vars)}

    <p>You can send this directly to your client via email or share the payment link.</p>
  `;

  return {
    subject: `Invoice Created: ${vars.invoiceNumber} for ${vars.clientName}`,
    html: renderBaseEmailLayout({
      title: "Invoice Generated Successfully",
      preheader: `Invoice ${vars.invoiceNumber} for ${vars.amount} is ready.`,
      badge: "Invoice Created",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Manage Invoice",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/invoicing/manage",
    }),
  };
}

export function renderInvoiceSentToClient(vars: {
  merchantName: string;
  clientName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  paymentUrl: string;
  description?: string;
}): { subject: string; html: string } {
  const content = `
    <p>Dear <strong>${vars.clientName}</strong>,</p>
    <p>You have received a new electronic tax invoice from <strong>${vars.merchantName}</strong> via the TaxFilling compliance portal.</p>
    
    ${renderInvoiceSummaryBox(vars)}

    <p>Please review the invoice breakdown and click the button below to view the official PDF or complete settlement online via bank transfer, USSD, or card:</p>
  `;

  return {
    subject: `Invoice from ${vars.merchantName} (#${vars.invoiceNumber}) — ${vars.amount} due ${vars.dueDate}`,
    html: renderBaseEmailLayout({
      title: `Invoice #${vars.invoiceNumber}`,
      preheader: `Invoice from ${vars.merchantName} for ${vars.amount} due on ${vars.dueDate}.`,
      badge: "Payment Request",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "View & Pay Invoice Online",
      ctaUrl: vars.paymentUrl,
    }),
  };
}

export function renderInvoicePaymentReceived(vars: {
  merchantName?: string;
  clientName: string;
  invoiceNumber: string;
  amount: string;
  paymentReference: string;
}): { subject: string; html: string } {
  const name = vars.merchantName || "Merchant";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Great news! A payment of <strong>${vars.amount}</strong> was received from <strong>${vars.clientName}</strong> for Invoice <strong>${vars.invoiceNumber}</strong>.</p>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 20px 0;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size: 13px; color: #166534;">Payment Reference</td>
          <td align="right" style="font-family: monospace; font-size: 13px; font-weight: bold; color: #166534;">${vars.paymentReference}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #166534; padding-top: 8px;">Settlement Status</td>
          <td align="right" style="font-size: 13px; font-weight: bold; color: #166534; padding-top: 8px;">PAID &amp; RECONCILED</td>
        </tr>
      </table>
    </div>

    <p>Your VAT and WHT registers have been updated automatically.</p>
  `;

  return {
    subject: `Payment Received: ${vars.amount} for Invoice #${vars.invoiceNumber} 🎉`,
    html: renderBaseEmailLayout({
      title: "Invoice Paid in Full",
      preheader: `Payment of ${vars.amount} received from ${vars.clientName}.`,
      badge: "Paid & Reconciled",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "View Invoice Details",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/invoicing/payments",
    }),
  };
}

export function renderInvoicePaymentReceiptClient(vars: {
  clientName: string;
  merchantName: string;
  invoiceNumber: string;
  amount: string;
  paymentReference: string;
  receiptUrl?: string;
}): { subject: string; html: string } {
  const content = `
    <p>Dear <strong>${vars.clientName}</strong>,</p>
    <p>Thank you! Your payment of <strong>${vars.amount}</strong> to <strong>${vars.merchantName}</strong> for Invoice <strong>${vars.invoiceNumber}</strong> has been confirmed.</p>
    
    <div style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.14); border-radius: 12px; padding: 18px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #4b5563;">
        <strong>Reference:</strong> ${vars.paymentReference}<br />
        <strong>Status:</strong> Successfully Settled
      </p>
    </div>

    <p>You can download your official tax receipt for your business expense records below.</p>
  `;

  return {
    subject: `Payment Receipt: ${vars.amount} for Invoice #${vars.invoiceNumber}`,
    html: renderBaseEmailLayout({
      title: "Payment Receipt",
      preheader: `Your payment to ${vars.merchantName} for ${vars.amount} was successful.`,
      badge: "Settlement Confirmed",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Download Receipt",
      ctaUrl: vars.receiptUrl || "https://taxfiling.com.ng/customer-dashboard/receipts",
    }),
  };
}

export function renderInvoicePaymentOverdue(vars: {
  clientName: string;
  merchantName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  paymentUrl: string;
}): { subject: string; html: string } {
  const content = `
    <p>Dear <strong>${vars.clientName}</strong>,</p>
    <p>This is an important reminder that Invoice <strong>${vars.invoiceNumber}</strong> from <strong>${vars.merchantName}</strong> for the amount of <strong>${vars.amount}</strong> was due on <strong>${vars.dueDate}</strong> and is currently <strong>overdue</strong>.</p>
    
    ${renderInvoiceSummaryBox(vars)}

    <p>To keep your account in good standing and avoid service disruption, please complete payment as soon as possible:</p>
  `;

  return {
    subject: `Overdue Notice: Invoice #${vars.invoiceNumber} (${vars.amount}) from ${vars.merchantName}`,
    html: renderBaseEmailLayout({
      title: "Invoice Overdue — Action Required",
      preheader: `Invoice ${vars.invoiceNumber} for ${vars.amount} is past due date ${vars.dueDate}.`,
      badge: "Overdue Notice",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Pay Overdue Invoice",
      ctaUrl: vars.paymentUrl,
    }),
  };
}

export function renderInvoiceReminder(vars: {
  clientName: string;
  merchantName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  paymentUrl: string;
}): { subject: string; html: string } {
  const content = `
    <p>Dear <strong>${vars.clientName}</strong>,</p>
    <p>This is a friendly reminder that Invoice <strong>${vars.invoiceNumber}</strong> from <strong>${vars.merchantName}</strong> is due on <strong>${vars.dueDate}</strong>.</p>
    
    ${renderInvoiceSummaryBox(vars)}

    <p>You can settle this invoice securely online anytime before the due date:</p>
  `;

  return {
    subject: `Reminder: Invoice #${vars.invoiceNumber} from ${vars.merchantName} is due soon`,
    html: renderBaseEmailLayout({
      title: "Friendly Invoice Reminder",
      preheader: `Reminder: ${vars.amount} for invoice ${vars.invoiceNumber} is due on ${vars.dueDate}.`,
      badge: "Due Soon",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "View & Pay Invoice",
      ctaUrl: vars.paymentUrl,
    }),
  };
}

export function renderInvoiceCancelled(vars: {
  clientName: string;
  merchantName: string;
  invoiceNumber: string;
}): { subject: string; html: string } {
  const content = `
    <p>Dear <strong>${vars.clientName}</strong>,</p>
    <p>Please note that Invoice <strong>${vars.invoiceNumber}</strong> previously issued by <strong>${vars.merchantName}</strong> has been <strong>cancelled/voided</strong>.</p>
    <p>No further payment is required for this invoice reference. If a replacement invoice is issued, you will receive a separate notification.</p>
  `;

  return {
    subject: `Notice: Invoice #${vars.invoiceNumber} has been cancelled by ${vars.merchantName}`,
    html: renderBaseEmailLayout({
      title: "Invoice Cancelled",
      preheader: `Invoice ${vars.invoiceNumber} was cancelled.`,
      badge: "Voided",
      badgeColor: "coral",
      contentHtml: content,
    }),
  };
}
