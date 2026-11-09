import { renderBaseEmailLayout } from "./base";

export function renderPromoRentRelief(vars: { fullName?: string; unsubscribeUrl?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Did you know that Nigerian tax regulations allow salaried employees and self-employed individuals to claim tax deductions on rental payments made for residential accommodation?</p>

    <div style="background-color: #fcfaf5; border: 1px solid #18623f; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #18623f;">Why Claim Rent Relief with TaxFilling?</h3>
      <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
        <li><strong>Legitimate Tax Savings:</strong> Reduce your taxable income with official rental expense proof.</li>
        <li><strong>FIRS & FCT-IRS Compliant:</strong> Automatically formats verified landlord and taxpayer TIN data.</li>
        <li><strong>Security Hologram Stamp:</strong> Includes unique verification QR code and cryptographic receipt ID.</li>
        <li><strong>Employer & Audit Ready:</strong> Ready for submission to corporate HR and state internal revenue services.</li>
      </ul>
    </div>

    <p>Generating your first compliant rent receipt takes less than 3 minutes.</p>
  `;

  return {
    subject: "Claim Your Legitimate Rent Relief Tax Deduction in Nigeria 🏠",
    html: renderBaseEmailLayout({
      title: "Save on Personal Income Tax with Verified Rent Receipts",
      preheader: "Generate official FCT-IRS & FIRS compliant rent relief receipts in minutes.",
      badge: "Tax Relief Spotlight",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Generate Rent Receipt Now",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipt/new",
      isMarketing: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

export function renderPromoEInvoicing(vars: { fullName?: string; unsubscribeUrl?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Are you still sending manual PDF or paper invoices to your clients? Upgrade to <strong>TaxFilling E-Invoicing</strong> — the smart, compliant invoicing portal tailored for Nigerian freelancers, agencies, and SMEs.</p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <ul style="margin: 0; padding-left: 20px; color: #14532d; font-size: 14px; line-height: 1.8;">
        <li><strong>Automatic 7.5% VAT & WHT Calculation:</strong> Never make manual tax arithmetic errors again.</li>
        <li><strong>Direct Paystack Payment Links:</strong> Allow clients to pay instantly via Card, USSD, or Bank Transfer.</li>
        <li><strong>Real-time Payment Tracking:</strong> Know the exact moment an invoice is viewed and paid.</li>
        <li><strong>One-Click Client Receipts:</strong> Generate automated receipts immediately upon settlement.</li>
      </ul>
    </div>

    <p>Get started today with our reusable invoice templates.</p>
  `;

  return {
    subject: "Streamline Your Business with Compliant Nigerian E-Invoicing 💼",
    html: renderBaseEmailLayout({
      title: "Compliant E-Invoicing Built for Nigeria",
      preheader:
        "Issue professional invoices with automated VAT, WHT, and online payment collection.",
      badge: "Business Tools",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Create First Invoice",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/invoicing/manage",
      isMarketing: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

export function renderPromoPremiumUpgrade(vars: { fullName?: string; unsubscribeUrl?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Navigating Nigerian tax compliance can be stressful and complex. With <strong>TaxFilling Premium</strong>, you get an elite dedicated tax consultant working with you personally throughout the tax year.</p>

    <div style="background-color: #fcfaf5; border: 2px solid #ffe95c; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #18623f;">Included in Premium:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
        <li><strong>Dedicated Tax Consultant:</strong> One-on-one advisory for business and personal tax strategy.</li>
        <li><strong>Withholding Tax (WHT) Automation:</strong> Automated credit note reconciliation with FIRS.</li>
        <li><strong>Comprehensive Audit Defense:</strong> Complete documentation prep in case of tax office queries.</li>
        <li><strong>Full API & Payroll Access:</strong> Seamless payroll integration for high-volume transactions.</li>
      </ul>
    </div>

    <p>Take the uncertainty out of tax season with our most comprehensive protection tier.</p>
  `;

  return {
    subject: "Unlock Dedicated Tax Consultant & WHT Automation with Premium ⭐",
    html: renderBaseEmailLayout({
      title: "Experience Stress-Free Corporate Tax Compliance",
      preheader: "Get a dedicated consultant, automated WHT, and full audit protection.",
      badge: "Premium Upgrade",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Upgrade to Premium",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
      isMarketing: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

export function renderPromoDeluxeUpgrade(vars: { fullName?: string; unsubscribeUrl?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Ready to supercharge your filing experience? Upgrade from Free to <strong>Deluxe</strong> for just <strong>₦12,500/month</strong> (or ₦10,000/month billed annually).</p>

    <div style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.18); border-radius: 12px; padding: 18px; margin: 20px 0;">
      <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
        <li><strong>Unlimited Personal Income Tax (PIT) filings</strong></li>
        <li><strong>Full Value Added Tax (VAT) monthly filing portal</strong></li>
        <li><strong>Bulk Batch generation (up to 50 rent receipts)</strong></li>
        <li><strong>Priority chat support and TIN verification</strong></li>
      </ul>
    </div>
  `;

  return {
    subject: "Upgrade to Deluxe: Unlimited VAT, PIT Filings & Batch Receipts 🚀",
    html: renderBaseEmailLayout({
      title: "Unlock Unlimited Tax Filings",
      preheader: "Upgrade to Deluxe for unlimited PIT, VAT, and batch receipt generation.",
      badge: "Upgrade Offer",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Upgrade to Deluxe Now",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
      isMarketing: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

export function renderPromoNewFeatures(vars: {
  fullName?: string;
  featureTitle: string;
  featureDescription: string;
  unsubscribeUrl?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We are excited to announce a major new capability inside your TaxFilling workspace:</p>

    <div style="background-color: #fcfaf5; border-left: 4px solid #18623f; border-radius: 8px; padding: 18px 22px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px 0; color: #18623f; font-size: 17px;">${vars.featureTitle}</h3>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">${vars.featureDescription}</p>
    </div>

    <p>Log into your dashboard today to test the new functionality.</p>
  `;

  return {
    subject: `New Feature Announcement: ${vars.featureTitle} on TaxFilling ✨`,
    html: renderBaseEmailLayout({
      title: "New on TaxFilling",
      preheader: `Discover our newest feature: ${vars.featureTitle}`,
      badge: "Product Update",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Try It in Dashboard",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard",
      isMarketing: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

export function renderPromoSpecialOffer(vars: {
  fullName?: string;
  discountPercentage: number;
  promoCode: string;
  validUntil: string;
  unsubscribeUrl?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>For a limited time, get <strong>${vars.discountPercentage}% OFF</strong> any annual TaxFilling subscription package!</p>

    <div style="background-color: #fcfaf5; border: 2px dashed #ffe95c; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 800; color: #18623f; text-transform: uppercase; letter-spacing: 1px;">Exclusive Promo Code</div>
      <div style="font-family: monospace; font-size: 30px; font-weight: 900; color: #18623f; letter-spacing: 4px; margin: 8px 0;">
        ${vars.promoCode}
      </div>
      <div style="font-size: 13px; color: #6b7280;">Valid until <strong>${vars.validUntil}</strong> on all annual subscriptions.</div>
    </div>
  `;

  return {
    subject: `Special Offer: Save ${vars.discountPercentage}% on Your TaxFilling Subscription 🎁`,
    html: renderBaseEmailLayout({
      title: `Special Offer: ${vars.discountPercentage}% Discount`,
      preheader: `Use code ${vars.promoCode} to save ${vars.discountPercentage}% before ${vars.validUntil}.`,
      badge: "Limited Offer",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Claim Discount Now",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
      isMarketing: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}
