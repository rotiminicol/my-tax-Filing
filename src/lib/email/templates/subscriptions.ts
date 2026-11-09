import { renderBaseEmailLayout } from "./base";

function formatPlanName(plan: string): string {
  if (plan === "deluxe") return "Deluxe Plan";
  if (plan === "premium") return "Premium Plan";
  return "Free Plan";
}

function renderReceiptSummaryBox(params: {
  plan: string;
  amount: string;
  cycle: string;
  reference?: string;
  renewalDate?: string;
}): string {
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.14); border-radius: 12px; margin: 20px 0; overflow: hidden;">
      <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid rgba(24,98,63,0.1);">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 13px; color: #6b7280; font-weight: 600;">Subscription Tier</td>
              <td align="right" style="font-size: 15px; font-weight: 800; color: #18623f;">${formatPlanName(params.plan)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid rgba(24,98,63,0.1);">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 13px; color: #6b7280; font-weight: 600;">Billing Cadence</td>
              <td align="right" style="font-size: 14px; font-weight: 700; color: #1f2937; text-transform: capitalize;">${params.cycle}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid rgba(24,98,63,0.1);">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 13px; color: #6b7280; font-weight: 600;">Amount</td>
              <td align="right" style="font-size: 18px; font-weight: 900; color: #18623f;">${params.amount}</td>
            </tr>
          </table>
        </td>
      </tr>
      ${
        params.reference
          ? `
      <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid rgba(24,98,63,0.1);">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 12px; color: #6b7280;">Payment Reference</td>
              <td align="right" style="font-family: monospace; font-size: 12px; color: #374151;">${params.reference}</td>
            </tr>
          </table>
        </td>
      </tr>`
          : ""
      }
      ${
        params.renewalDate
          ? `
      <tr>
        <td style="padding: 12px 20px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 12px; color: #6b7280;">Next Renewal Date</td>
              <td align="right" style="font-size: 13px; font-weight: 600; color: #1f2937;">${params.renewalDate}</td>
            </tr>
          </table>
        </td>
      </tr>`
          : ""
      }
    </table>
  `;
}

export function renderSubscriptionStarted(vars: {
  fullName?: string;
  plan: string;
  amount: string;
  cycle: string;
  reference?: string;
  renewalDate?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for subscribing! Your <strong>${formatPlanName(vars.plan)}</strong> subscription is now active.</p>
    <p>All premium tools, unlimited filing quotas, and priority features associated with your plan have been unlocked in your dashboard.</p>
    
    ${renderReceiptSummaryBox(vars)}

    <p>You can manage your subscription, download receipts, or update payment settings anytime from your account.</p>
  `;

  return {
    subject: `Subscription Confirmed: Welcome to ${formatPlanName(vars.plan)}`,
    html: renderBaseEmailLayout({
      title: "Subscription Activated",
      preheader: `Your ${formatPlanName(vars.plan)} subscription is active.`,
      badge: "Active Subscription",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Open Dashboard",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard",
    }),
  };
}

export function renderPaymentReceipt(vars: {
  fullName?: string;
  plan: string;
  amount: string;
  cycle: string;
  reference: string;
  date?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>This email confirms that your subscription payment of <strong>${vars.amount}</strong> was successfully processed by Paystack.</p>
    
    ${renderReceiptSummaryBox(vars)}

    <p style="font-size: 13px; color: #6b7280;">This email serves as an official receipt for tax deduction and business expense accounting purposes.</p>
  `;

  return {
    subject: `Payment Receipt: ${vars.amount} for ${formatPlanName(vars.plan)}`,
    html: renderBaseEmailLayout({
      title: "Payment Receipt",
      preheader: `Receipt for ${vars.amount} payment to TaxFilling. Reference: ${vars.reference}`,
      badge: "Paid Successfully",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "View Billing History",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderSubscriptionRenewed(vars: {
  fullName?: string;
  plan: string;
  amount: string;
  cycle: string;
  nextRenewalDate: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your subscription to <strong>${formatPlanName(vars.plan)}</strong> has been successfully renewed. Your uninterrupted access continues through <strong>${vars.nextRenewalDate}</strong>.</p>
    
    ${renderReceiptSummaryBox({ ...vars, renewalDate: vars.nextRenewalDate })}
  `;

  return {
    subject: `Subscription Renewed: ${formatPlanName(vars.plan)}`,
    html: renderBaseEmailLayout({
      title: "Subscription Renewed",
      preheader: `Your ${formatPlanName(vars.plan)} has been renewed until ${vars.nextRenewalDate}.`,
      badge: "Renewed",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Manage Subscription",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderRenewalReminder(vars: {
  fullName?: string;
  plan: string;
  amount: string;
  renewalDate: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>This is a quick notice that your <strong>${formatPlanName(vars.plan)}</strong> subscription is scheduled to renew on <strong>${vars.renewalDate}</strong> for <strong>${vars.amount}</strong>.</p>
    <p>No action is needed if you wish to keep your subscription active. If you would like to make changes to your plan or payment method, please visit your billing settings before the renewal date.</p>
  `;

  return {
    subject: `Notice: Upcoming Subscription Renewal on ${vars.renewalDate}`,
    html: renderBaseEmailLayout({
      title: "Upcoming Subscription Renewal",
      preheader: `Your ${formatPlanName(vars.plan)} renews on ${vars.renewalDate}.`,
      badge: "Renewal Notice",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Review Subscription",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderPaymentFailed(vars: {
  fullName?: string;
  plan: string;
  amount: string;
  reason?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const reasonText = vars.reason || "Bank card declined or insufficient funds.";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We attempted to process your subscription renewal of <strong>${vars.amount}</strong> for <strong>${formatPlanName(vars.plan)}</strong>, but the transaction could not be completed.</p>
    
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b;"><strong>Decline Reason:</strong> ${reasonText}</p>
    </div>

    <p>To avoid service disruption or restriction of premium features, please update your payment method or retry the transaction.</p>
  `;

  return {
    subject: `Payment Failed: Action Required for ${formatPlanName(vars.plan)}`,
    html: renderBaseEmailLayout({
      title: "Payment Unsuccessful",
      preheader: `Your subscription payment of ${vars.amount} could not be processed.`,
      badge: "Payment Failed",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Update Payment Method",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderSubscriptionExpiringSoon(vars: {
  fullName?: string;
  plan: string;
  expiryDate: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your subscription to <strong>${formatPlanName(vars.plan)}</strong> will expire on <strong>${vars.expiryDate}</strong>.</p>
    <p>After this date, your account will revert to the Free tier and features such as batch receipt generation, priority support, and audit tools will be limited.</p>
    <p>Renew now to maintain your compliance access without interruptions.</p>
  `;

  return {
    subject: `Reminder: Your ${formatPlanName(vars.plan)} Expires Soon`,
    html: renderBaseEmailLayout({
      title: "Subscription Expiring Soon",
      preheader: `Your ${formatPlanName(vars.plan)} will expire on ${vars.expiryDate}.`,
      badge: "Expiring Soon",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Renew Subscription",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderSubscriptionExpired(vars: { fullName?: string; plan: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your subscription to <strong>${formatPlanName(vars.plan)}</strong> has now expired.</p>
    <p>Your account has been switched to the Free tier. Your previous receipts and records remain safely stored, but premium filing tools are currently paused.</p>
    <p>You can reactivate your subscription anytime with instant unlocking.</p>
  `;

  return {
    subject: `Your ${formatPlanName(vars.plan)} Subscription Has Expired`,
    html: renderBaseEmailLayout({
      title: "Subscription Expired",
      preheader: `Your ${formatPlanName(vars.plan)} has expired. Re-subscribe anytime.`,
      badge: "Expired",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Reactivate Subscription",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderSubscriptionCancelled(vars: {
  fullName?: string;
  plan: string;
  effectiveDate?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We have received your cancellation request for the <strong>${formatPlanName(vars.plan)}</strong> subscription.</p>
    <p>You will continue to have access to your plan features until the end of your current billing period on <strong>${vars.effectiveDate || "the period end"}</strong>.</p>
    <p>You won't be charged again. We'd love to welcome you back whenever you need our services again!</p>
  `;

  return {
    subject: `Subscription Cancelled: ${formatPlanName(vars.plan)}`,
    html: renderBaseEmailLayout({
      title: "Subscription Cancelled",
      preheader: `Your ${formatPlanName(vars.plan)} subscription has been cancelled.`,
      badge: "Cancelled",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "View Subscription Settings",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/subscription",
    }),
  };
}

export function renderSubscriptionUpgraded(vars: {
  fullName?: string;
  oldPlan: string;
  newPlan: string;
  amount: string;
  cycle: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Congratulations on upgrading your account! You have switched from <strong>${formatPlanName(vars.oldPlan)}</strong> to <strong>${formatPlanName(vars.newPlan)}</strong>.</p>
    <p>Your enhanced quotas, priority support, and premium filing capabilities are now ready in your workspace.</p>
    
    ${renderReceiptSummaryBox({ plan: vars.newPlan, amount: vars.amount, cycle: vars.cycle })}
  `;

  return {
    subject: `Upgrade Confirmed: Welcome to ${formatPlanName(vars.newPlan)}! 🎉`,
    html: renderBaseEmailLayout({
      title: "Subscription Upgraded",
      preheader: `You've upgraded to ${formatPlanName(vars.newPlan)}.`,
      badge: "Plan Upgraded",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Explore New Features",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard",
    }),
  };
}

export function renderSubscriptionDowngraded(vars: {
  fullName?: string;
  previousPlan: string;
  newPlan: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>This email confirms that your subscription has been changed from <strong>${formatPlanName(vars.previousPlan)}</strong> to <strong>${formatPlanName(vars.newPlan)}</strong>.</p>
    <p>Your new plan limits will apply accordingly. Your previously generated receipts and tax records will remain permanently accessible in your account.</p>
  `;

  return {
    subject: `Plan Changed: Switched to ${formatPlanName(vars.newPlan)}`,
    html: renderBaseEmailLayout({
      title: "Plan Changed",
      preheader: `Your plan is now set to ${formatPlanName(vars.newPlan)}.`,
      badge: "Plan Updated",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Manage Dashboard",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard",
    }),
  };
}

export function renderFreePlanActivated(vars: { fullName?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your <strong>Free Starter Plan</strong> is now active. You have access to essential tax-filing tools, basic PIT filing, and single rent receipt generation (up to 5 receipts per month) with 50MB secure document storage.</p>
    <p>Whenever you are ready for bulk batches, VAT filing, or dedicated consulting, you can easily upgrade to Deluxe or Premium.</p>
  `;

  return {
    subject: "Free Starter Plan Activated — TaxFilling",
    html: renderBaseEmailLayout({
      title: "Free Plan Activated",
      preheader: "Your free filing profile is active.",
      badge: "Free Tier",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Generate First Receipt",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/receipt/new",
    }),
  };
}
