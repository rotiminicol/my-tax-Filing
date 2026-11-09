import { renderBaseEmailLayout } from "./base";

export function renderWelcomeEmail(vars: { fullName?: string; email: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Welcome to <strong>TaxFilling</strong> — Nigeria's dedicated portal for Personal Income Tax, Rent Relief claims, e-invoicing, and regulatory compliance.</p>
    
    <div style="background-color: #fcfaf5; border-left: 4px solid #18623f; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 800; color: #18623f; font-size: 14px;">Here is what you can do right away:</p>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.7;">
        <li>Generate official <strong>Rent Relief Tax Receipts</strong> for annual allowance claims.</li>
        <li>Track upcoming <strong>Personal Income Tax (PIT) and VAT</strong> filing deadlines.</li>
        <li>Create and send compliant <strong>E-Invoices</strong> with payment tracking.</li>
        <li>Renew driver's licenses, passports, and tax clearance certificates.</li>
      </ul>
    </div>

    <p>Your account is created under <strong>${vars.email}</strong>. Get started by completing your taxpayer profile to ensure audit-ready filings.</p>
  `;

  return {
    subject: "Welcome to TaxFilling — Your Compliance Workspace is Ready",
    html: renderBaseEmailLayout({
      title: "Welcome to TaxFilling Nigeria 🇳🇬",
      preheader:
        "Your account has been created. Start filing compliant tax receipts and managing obligations.",
      badge: "Account Created",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Go to Customer Dashboard",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard",
    }),
  };
}

export function renderVerifyEmailOtp(vars: {
  fullName?: string;
  otp: string;
  expiresInMinutes?: number;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const exp = vars.expiresInMinutes ?? 10;
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Please enter the 6-digit verification code below to verify your email address and activate your TaxFilling profile:</p>

    <div style="background-color: #fcfaf5; border: 2px dashed #18623f; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; color: #18623f; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Your One-Time Code</div>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #18623f;">
        ${vars.otp}
      </div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">Valid for <strong>${exp} minutes</strong>. Do not share this code.</div>
    </div>

    <p style="font-size: 13px; color: #6b7280;">If you did not initiate this registration, please ignore this email or notify our security team.</p>
  `;

  return {
    subject: `${vars.otp} is your TaxFilling verification code`,
    html: renderBaseEmailLayout({
      title: "Verify Your Email Address",
      preheader: `Use code ${vars.otp} to verify your TaxFilling account.`,
      badge: "Verification OTP",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Verify on TaxFilling",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/verify-email",
    }),
  };
}

export function renderResendVerificationOtp(vars: { fullName?: string; otp: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>You requested a new verification code for your TaxFilling account. Use the code below:</p>

    <div style="background-color: #fcfaf5; border: 2px dashed #18623f; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; color: #18623f; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">New Verification Code</div>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #18623f;">
        ${vars.otp}
      </div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">Valid for 10 minutes. Replaces any previous code.</div>
    </div>
  `;

  return {
    subject: `New code: ${vars.otp} — TaxFilling verification`,
    html: renderBaseEmailLayout({
      title: "New Verification Code",
      preheader: `Your new verification code is ${vars.otp}.`,
      badge: "Resend Code",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Enter Code",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/verify-email",
    }),
  };
}

export function renderPasswordResetOtp(vars: { fullName?: string; otp: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your TaxFilling account. Use the authorization code below to proceed with setting a new password:</p>

    <div style="background-color: #fcfaf5; border: 2px solid #ffe95c; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 800; color: #18623f; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Password Reset Code</div>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #18623f;">
        ${vars.otp}
      </div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">Expires in 15 minutes.</div>
    </div>

    <p style="font-size: 13px; color: #dc2626;"><strong>Security Alert:</strong> If you did not request this password reset, your credentials may be compromised. Please sign in immediately and change your password.</p>
  `;

  return {
    subject: `${vars.otp} is your TaxFilling password reset code`,
    html: renderBaseEmailLayout({
      title: "Reset Your Account Password",
      preheader: `Use code ${vars.otp} to reset your password.`,
      badge: "Password Reset",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Reset Password",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/reset-password",
    }),
  };
}

export function renderPasswordChanged(vars: { fullName?: string; timestamp?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const time = vars.timestamp || new Date().toUTCString();
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>The password for your TaxFilling account was successfully changed on <strong>${time}</strong>.</p>
    <p>You can now sign in using your new password on any device.</p>
    
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b;">
        <strong>Didn't make this change?</strong> Please contact support immediately at <a href="mailto:support@taxfiling.com.ng" style="color: #991b1b; font-weight: bold;">support@taxfiling.com.ng</a> to secure your account.
      </p>
    </div>
  `;

  return {
    subject: "Security Notification: Password Changed Successfully",
    html: renderBaseEmailLayout({
      title: "Password Updated",
      preheader: "Your TaxFilling account password was recently updated.",
      badge: "Security Update",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "Sign In to Account",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/login",
    }),
  };
}

export function renderProfileUpdated(vars: { fullName?: string; updatedFields?: string[] }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const fields = vars.updatedFields?.join(", ") || "Tax Identification / Profile details";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your TaxFilling profile information was recently updated. The modified details include: <strong>${fields}</strong>.</p>
    <p>Your filings and official rent receipts will now reflect these updated details automatically.</p>
  `;

  return {
    subject: "TaxFilling Profile Successfully Updated",
    html: renderBaseEmailLayout({
      title: "Profile Information Updated",
      preheader: "Your taxpayer profile details have been saved.",
      badge: "Profile Sync",
      badgeColor: "mint",
      contentHtml: content,
      ctaText: "View Profile",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/profile",
    }),
  };
}

export function renderPhoneOrEmailChanged(vars: {
  fullName?: string;
  changeType: "phone" | "email";
  newValue: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const label = vars.changeType === "phone" ? "phone number" : "email address";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>The primary <strong>${label}</strong> on your TaxFilling profile has been changed to: <strong>${vars.newValue}</strong>.</p>
    <p>This identifier can now be used for login authentication and receiving one-time security codes.</p>
  `;

  return {
    subject: `Security Alert: Primary ${label.toUpperCase()} Changed`,
    html: renderBaseEmailLayout({
      title: "Account Identifier Updated",
      preheader: `Your primary ${label} has been updated.`,
      badge: "Security Alert",
      badgeColor: "yellow",
      contentHtml: content,
      ctaText: "Review Account Security",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/settings",
    }),
  };
}

export function renderAccountDeleted(vars: { fullName?: string }): {
  subject: string;
  html: string;
} {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your TaxFilling account and all associated profile records, receipts, and filings have been permanently deleted in accordance with your request.</p>
    <p>Thank you for using TaxFilling. If you ever need compliant filing services in the future, you are welcome to register a new account anytime.</p>
  `;

  return {
    subject: "Account Deletion Confirmation — TaxFilling",
    html: renderBaseEmailLayout({
      title: "Account Permanently Deleted",
      preheader: "Your TaxFilling account and personal data have been deleted.",
      badge: "Account Closed",
      badgeColor: "coral",
      contentHtml: content,
    }),
  };
}

export function renderSecurityAlert(vars: {
  fullName?: string;
  eventDescription: string;
  ipAddress?: string;
  location?: string;
}): { subject: string; html: string } {
  const name = vars.fullName || "Taxpayer";
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We detected an important security event on your TaxFilling account:</p>

    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 8px; margin: 18px 0;">
      <p style="margin: 0; font-weight: bold; color: #991b1b;">${vars.eventDescription}</p>
      ${vars.ipAddress ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: #7f1d1d;">IP Address: ${vars.ipAddress}</p>` : ""}
      ${vars.location ? `<p style="margin: 2px 0 0 0; font-size: 13px; color: #7f1d1d;">Location: ${vars.location}</p>` : ""}
    </div>

    <p>If this was you, you can safely ignore this notification. If you did not initiate this action, please secure your account immediately.</p>
  `;

  return {
    subject: "Action Required: TaxFilling Security Notification",
    html: renderBaseEmailLayout({
      title: "Security Notice",
      preheader: "Important security notification regarding your account.",
      badge: "Security Alert",
      badgeColor: "coral",
      contentHtml: content,
      ctaText: "Secure Account Now",
      ctaUrl: "https://taxfiling.com.ng/customer-dashboard/settings",
    }),
  };
}
