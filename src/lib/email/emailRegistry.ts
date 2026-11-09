import * as auth from "./templates/auth";
import * as subs from "./templates/subscriptions";
import * as marketing from "./templates/marketing";
import * as rentRelief from "./templates/rentRelief";
import * as invoicing from "./templates/invoicing";
import * as taxFiling from "./templates/taxFiling";
import * as support from "./templates/support";

export interface EmailTemplateDefinition {
  id: string;
  name: string;
  category:
    "auth" | "subscriptions" | "marketing" | "rent_relief" | "invoicing" | "taxes" | "support";
  description: string;
  defaultSubject: string;
  sampleData: Record<string, unknown>;
  render: (data: Record<string, unknown>) => { subject: string; html: string };
}

export const EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  // A. Auth & Account
  {
    id: "welcome",
    name: "Welcome Email",
    category: "auth",
    description: "Sent immediately after successful user registration",
    defaultSubject: "Welcome to TaxFilling — Your Compliance Workspace is Ready",
    sampleData: { fullName: "Adebayo Olawale", email: "adebayo@example.com" },
    render: (d) => auth.renderWelcomeEmail(d as Parameters<typeof auth.renderWelcomeEmail>[0]),
  },
  {
    id: "verify_email_otp",
    name: "Email Verification OTP",
    category: "auth",
    description: "One-time 6-digit code for verifying email address",
    defaultSubject: "482910 is your TaxFilling verification code",
    sampleData: { fullName: "Adebayo Olawale", otp: "482910", expiresInMinutes: 10 },
    render: (d) => auth.renderVerifyEmailOtp(d as Parameters<typeof auth.renderVerifyEmailOtp>[0]),
  },
  {
    id: "resend_verification_otp",
    name: "Resend Verification OTP",
    category: "auth",
    description: "Requested replacement OTP during email confirmation",
    defaultSubject: "New code: 739102 — TaxFilling verification",
    sampleData: { fullName: "Adebayo Olawale", otp: "739102" },
    render: (d) =>
      auth.renderResendVerificationOtp(d as Parameters<typeof auth.renderResendVerificationOtp>[0]),
  },
  {
    id: "password_reset_otp",
    name: "Password Reset OTP",
    category: "auth",
    description: "Verification code sent to authorize password recovery",
    defaultSubject: "904128 is your TaxFilling password reset code",
    sampleData: { fullName: "Adebayo Olawale", otp: "904128" },
    render: (d) =>
      auth.renderPasswordResetOtp(d as Parameters<typeof auth.renderPasswordResetOtp>[0]),
  },
  {
    id: "password_changed",
    name: "Password Changed Alert",
    category: "auth",
    description: "Security alert confirming account password was successfully updated",
    defaultSubject: "Security Notification: Password Changed Successfully",
    sampleData: { fullName: "Adebayo Olawale", timestamp: "Mon, 09 Nov 2026 19:40:00 GMT" },
    render: (d) =>
      auth.renderPasswordChanged(d as Parameters<typeof auth.renderPasswordChanged>[0]),
  },
  {
    id: "profile_updated",
    name: "Profile Information Updated",
    category: "auth",
    description: "Notification when personal info, TIN, NIN, or employment changes",
    defaultSubject: "TaxFilling Profile Successfully Updated",
    sampleData: {
      fullName: "Adebayo Olawale",
      updatedFields: ["Tax Identification Number (TIN)", "State of Residence"],
    },
    render: (d) => auth.renderProfileUpdated(d as Parameters<typeof auth.renderProfileUpdated>[0]),
  },
  {
    id: "phone_or_email_changed",
    name: "Phone / Email Changed Alert",
    category: "auth",
    description: "Critical security alert when primary phone or email changes",
    defaultSubject: "Security Alert: Primary PHONE NUMBER Changed",
    sampleData: { fullName: "Adebayo Olawale", changeType: "phone", newValue: "+234 803 123 4567" },
    render: (d) =>
      auth.renderPhoneOrEmailChanged(d as Parameters<typeof auth.renderPhoneOrEmailChanged>[0]),
  },
  {
    id: "account_deleted",
    name: "Account Deletion Confirmation",
    category: "auth",
    description: "Confirmation sent when user permanently deletes account and data",
    defaultSubject: "Account Deletion Confirmation — TaxFilling",
    sampleData: { fullName: "Adebayo Olawale" },
    render: (d) => auth.renderAccountDeleted(d as Parameters<typeof auth.renderAccountDeleted>[0]),
  },
  {
    id: "security_alert",
    name: "Security Alert Notice",
    category: "auth",
    description: "Notification for suspicious activity or login from an unknown location",
    defaultSubject: "Action Required: TaxFilling Security Notification",
    sampleData: {
      fullName: "Adebayo Olawale",
      eventDescription: "New login from Chrome on Windows in Abuja, Nigeria",
      ipAddress: "197.210.226.4",
      location: "Abuja, Federal Capital Territory, Nigeria",
    },
    render: (d) => auth.renderSecurityAlert(d as Parameters<typeof auth.renderSecurityAlert>[0]),
  },

  // B. Subscriptions & Payments
  {
    id: "subscription_started",
    name: "Subscription Started",
    category: "subscriptions",
    description: "Confirmation immediately after subscribing to Deluxe or Premium",
    defaultSubject: "Subscription Confirmed: Welcome to Deluxe Plan",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      amount: "₦12,500",
      cycle: "monthly",
      reference: "tax_sub_89104",
      renewalDate: "Dec 9, 2026",
    },
    render: (d) =>
      subs.renderSubscriptionStarted(d as Parameters<typeof subs.renderSubscriptionStarted>[0]),
  },
  {
    id: "payment_receipt",
    name: "Subscription Payment Receipt",
    category: "subscriptions",
    description: "Official tax/expense receipt sent after successful subscription payment",
    defaultSubject: "Payment Receipt: ₦12,500 for Deluxe Plan",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      amount: "₦12,500",
      cycle: "monthly",
      reference: "paystack_ref_9812401",
    },
    render: (d) => subs.renderPaymentReceipt(d as Parameters<typeof subs.renderPaymentReceipt>[0]),
  },
  {
    id: "subscription_renewed",
    name: "Subscription Renewed",
    category: "subscriptions",
    description: "Confirmation that recurring subscription was renewed",
    defaultSubject: "Subscription Renewed: Deluxe Plan",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      amount: "₦12,500",
      cycle: "monthly",
      nextRenewalDate: "Jan 9, 2027",
    },
    render: (d) =>
      subs.renderSubscriptionRenewed(d as Parameters<typeof subs.renderSubscriptionRenewed>[0]),
  },
  {
    id: "renewal_reminder",
    name: "Subscription Renewal Reminder",
    category: "subscriptions",
    description: "Notice sent 7 days prior to next recurring charge",
    defaultSubject: "Notice: Upcoming Subscription Renewal on Dec 9, 2026",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      amount: "₦12,500",
      renewalDate: "Dec 9, 2026",
    },
    render: (d) =>
      subs.renderRenewalReminder(d as Parameters<typeof subs.renderRenewalReminder>[0]),
  },
  {
    id: "payment_failed",
    name: "Subscription Payment Failed",
    category: "subscriptions",
    description: "Notice sent when Paystack charge fails with retry CTA",
    defaultSubject: "Payment Failed: Action Required for Deluxe Plan",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      amount: "₦12,500",
      reason: "Card expired or insufficient funds",
    },
    render: (d) => subs.renderPaymentFailed(d as Parameters<typeof subs.renderPaymentFailed>[0]),
  },
  {
    id: "subscription_expiring_soon",
    name: "Subscription Expiring Soon",
    category: "subscriptions",
    description: "Notice sent when subscription will end and not auto-renew",
    defaultSubject: "Reminder: Your Deluxe Plan Expires Soon",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      expiryDate: "Dec 9, 2026",
    },
    render: (d) =>
      subs.renderSubscriptionExpiringSoon(
        d as Parameters<typeof subs.renderSubscriptionExpiringSoon>[0],
      ),
  },
  {
    id: "subscription_expired",
    name: "Subscription Expired",
    category: "subscriptions",
    description: "Notice sent when account switches back to Free tier",
    defaultSubject: "Your Deluxe Plan Subscription Has Expired",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
    },
    render: (d) =>
      subs.renderSubscriptionExpired(d as Parameters<typeof subs.renderSubscriptionExpired>[0]),
  },
  {
    id: "subscription_cancelled",
    name: "Subscription Cancelled",
    category: "subscriptions",
    description: "Confirmation of cancellation with active period reminder",
    defaultSubject: "Subscription Cancelled: Deluxe Plan",
    sampleData: {
      fullName: "Adebayo Olawale",
      plan: "deluxe",
      effectiveDate: "Dec 9, 2026",
    },
    render: (d) =>
      subs.renderSubscriptionCancelled(d as Parameters<typeof subs.renderSubscriptionCancelled>[0]),
  },
  {
    id: "subscription_upgraded",
    name: "Subscription Upgraded",
    category: "subscriptions",
    description: "Celebration email when upgrading from Free/Deluxe to higher tier",
    defaultSubject: "Upgrade Confirmed: Welcome to Premium Plan! 🎉",
    sampleData: {
      fullName: "Adebayo Olawale",
      oldPlan: "deluxe",
      newPlan: "premium",
      amount: "₦45,000",
      cycle: "monthly",
    },
    render: (d) =>
      subs.renderSubscriptionUpgraded(d as Parameters<typeof subs.renderSubscriptionUpgraded>[0]),
  },
  {
    id: "subscription_downgraded",
    name: "Subscription Downgraded",
    category: "subscriptions",
    description: "Confirmation of moving to a lower tier",
    defaultSubject: "Plan Changed: Switched to Free Plan",
    sampleData: {
      fullName: "Adebayo Olawale",
      previousPlan: "deluxe",
      newPlan: "free",
    },
    render: (d) =>
      subs.renderSubscriptionDowngraded(
        d as Parameters<typeof subs.renderSubscriptionDowngraded>[0],
      ),
  },
  {
    id: "free_plan_activated",
    name: "Free Plan Activation",
    category: "subscriptions",
    description: "Welcome email for users choosing the free starter tier",
    defaultSubject: "Free Starter Plan Activated — TaxFilling",
    sampleData: { fullName: "Adebayo Olawale" },
    render: (d) =>
      subs.renderFreePlanActivated(d as Parameters<typeof subs.renderFreePlanActivated>[0]),
  },

  // C. Marketing & Promotional
  {
    id: "promo_rent_relief",
    name: "Rent Relief Campaign",
    category: "marketing",
    description: "Promote claiming housing tax relief on residential rents",
    defaultSubject: "Claim Your Legitimate Rent Relief Tax Deduction in Nigeria 🏠",
    sampleData: { fullName: "Adebayo Olawale" },
    render: (d) =>
      marketing.renderPromoRentRelief(d as Parameters<typeof marketing.renderPromoRentRelief>[0]),
  },
  {
    id: "promo_e_invoicing",
    name: "E-Invoicing Campaign",
    category: "marketing",
    description: "Introduce electronic invoicing with automated VAT/WHT and Paystack",
    defaultSubject: "Streamline Your Business with Compliant Nigerian E-Invoicing 💼",
    sampleData: { fullName: "Adebayo Olawale" },
    render: (d) =>
      marketing.renderPromoEInvoicing(d as Parameters<typeof marketing.renderPromoEInvoicing>[0]),
  },
  {
    id: "promo_premium_upgrade",
    name: "Premium Dedicated Consultant",
    category: "marketing",
    description: "Promote Premium dedicated tax consultant and WHT automation",
    defaultSubject: "Unlock Dedicated Tax Consultant & WHT Automation with Premium ⭐",
    sampleData: { fullName: "Adebayo Olawale" },
    render: (d) =>
      marketing.renderPromoPremiumUpgrade(
        d as Parameters<typeof marketing.renderPromoPremiumUpgrade>[0],
      ),
  },
  {
    id: "promo_deluxe_upgrade",
    name: "Deluxe Unlimited Filing",
    category: "marketing",
    description: "Encourage Free subscribers to upgrade to Deluxe for unlimited filings",
    defaultSubject: "Upgrade to Deluxe: Unlimited VAT, PIT Filings & Batch Receipts 🚀",
    sampleData: { fullName: "Adebayo Olawale" },
    render: (d) =>
      marketing.renderPromoDeluxeUpgrade(
        d as Parameters<typeof marketing.renderPromoDeluxeUpgrade>[0],
      ),
  },
  {
    id: "promo_new_features",
    name: "New Feature Announcement",
    category: "marketing",
    description: "Broadcast newly launched features to user base",
    defaultSubject: "New Feature Announcement: Instant Bank Reconciliation on TaxFilling ✨",
    sampleData: {
      fullName: "Adebayo Olawale",
      featureTitle: "Instant Bank Statement Reconciliation",
      featureDescription:
        "Upload your corporate or personal Nigerian bank statements to automatically detect tax-deductible expenses and VAT credits.",
    },
    render: (d) =>
      marketing.renderPromoNewFeatures(d as Parameters<typeof marketing.renderPromoNewFeatures>[0]),
  },
  {
    id: "promo_special_discount",
    name: "Special Discount Promotion",
    category: "marketing",
    description: "Send discount codes for annual subscriptions",
    defaultSubject: "Special Offer: Save 20% on Your TaxFilling Subscription 🎁",
    sampleData: {
      fullName: "Adebayo Olawale",
      discountPercentage: 20,
      promoCode: "TAXRELIEF20",
      validUntil: "December 31, 2026",
    },
    render: (d) =>
      marketing.renderPromoSpecialOffer(
        d as Parameters<typeof marketing.renderPromoSpecialOffer>[0],
      ),
  },

  // D. Rent Relief Lifecycle
  {
    id: "rent_relief_created",
    name: "Rent Relief Created",
    category: "rent_relief",
    description: "Receipt generated with QR verification code and security stamp",
    defaultSubject: "Rent Receipt Generated: RR-2026-0819 — Ready for Relief Claim",
    sampleData: {
      fullName: "Adebayo Olawale",
      receiptId: "RR-2026-0819",
      annualRent: "₦2,400,000",
      allowanceClaimed: "₦100,000",
      propertyAddress: "Plot 14 Maitama Avenue, Abuja, FCT",
      landlordName: "Alhaji Musa Danjuma",
    },
    render: (d) =>
      rentRelief.renderRentReliefCreated(
        d as Parameters<typeof rentRelief.renderRentReliefCreated>[0],
      ),
  },
  {
    id: "rent_relief_submitted",
    name: "Rent Relief Claim Submitted",
    category: "rent_relief",
    description: "Claim submitted to FCT-IRS or State Internal Revenue Service",
    defaultSubject: "Rent Relief Claim Submitted to FCT Internal Revenue Service (FCT-IRS)",
    sampleData: {
      fullName: "Adebayo Olawale",
      receiptId: "RR-2026-0819",
      taxAuthority: "FCT Internal Revenue Service (FCT-IRS)",
    },
    render: (d) =>
      rentRelief.renderRentReliefSubmitted(
        d as Parameters<typeof rentRelief.renderRentReliefSubmitted>[0],
      ),
  },
  {
    id: "rent_relief_status_updated",
    name: "Rent Relief Status Updated",
    category: "rent_relief",
    description: "Claim progressed through verification workflow",
    defaultSubject: "Status Update: Rent Relief Claim #RR-2026-0819 is now Under Audit Review",
    sampleData: {
      fullName: "Adebayo Olawale",
      receiptId: "RR-2026-0819",
      newStatus: "Under Audit Review",
      statusNote: "Assessor assigned. Documents being matched against landlord TIN record.",
    },
    render: (d) =>
      rentRelief.renderRentReliefStatusUpdated(
        d as Parameters<typeof rentRelief.renderRentReliefStatusUpdated>[0],
      ),
  },
  {
    id: "rent_relief_approved",
    name: "Rent Relief Claim Approved",
    category: "rent_relief",
    description: "Claim approved by tax authority and tax credit credited",
    defaultSubject: "Approved: Rent Relief Claim #RR-2026-0819 Approved 🎉",
    sampleData: {
      fullName: "Adebayo Olawale",
      receiptId: "RR-2026-0819",
      approvedAmount: "₦100,000",
    },
    render: (d) =>
      rentRelief.renderRentReliefApproved(
        d as Parameters<typeof rentRelief.renderRentReliefApproved>[0],
      ),
  },
  {
    id: "rent_relief_rejected",
    name: "Rent Relief Correction Required",
    category: "rent_relief",
    description: "Claim rejected with correction feedback",
    defaultSubject: "Action Required: Rent Relief Claim #RR-2026-0819 Needs Correction",
    sampleData: {
      fullName: "Adebayo Olawale",
      receiptId: "RR-2026-0819",
      reason:
        "Landlord TIN could not be verified against the National Tax Database. Please recheck the landlord TIN number.",
    },
    render: (d) =>
      rentRelief.renderRentReliefRejected(
        d as Parameters<typeof rentRelief.renderRentReliefRejected>[0],
      ),
  },
  {
    id: "rent_relief_action_required",
    name: "Rent Relief Documents Required",
    category: "rent_relief",
    description: "Notice requesting tenancy agreement or proof of payment",
    defaultSubject: "Documents Required: Rent Relief Claim #RR-2026-0819",
    sampleData: {
      fullName: "Adebayo Olawale",
      receiptId: "RR-2026-0819",
      missingDocuments: [
        "Executed Tenancy Lease Agreement (Pages 1-3)",
        "Bank Payment Confirmation Teller",
      ],
    },
    render: (d) =>
      rentRelief.renderRentReliefActionRequired(
        d as Parameters<typeof rentRelief.renderRentReliefActionRequired>[0],
      ),
  },
  {
    id: "rent_relief_reminder",
    name: "Rent Relief Annual Deadline Reminder",
    category: "rent_relief",
    description: "Annual reminder to submit claims before tax year close",
    defaultSubject: "Reminder: Submit Your Annual Rent Relief Claims Before March 31, 2027",
    sampleData: {
      fullName: "Adebayo Olawale",
      deadlineDate: "March 31, 2027",
    },
    render: (d) =>
      rentRelief.renderRentReliefReminder(
        d as Parameters<typeof rentRelief.renderRentReliefReminder>[0],
      ),
  },

  // E. E-Invoicing
  {
    id: "invoice_created_merchant",
    name: "Invoice Created (Merchant)",
    category: "invoicing",
    description: "Sent to the user when a new customer invoice is saved",
    defaultSubject: "Invoice Created: #INV-2026-042 for Zenith Dynamics Ltd",
    sampleData: {
      merchantName: "Adebayo Tax Consulting Ltd",
      invoiceNumber: "INV-2026-042",
      clientName: "Zenith Dynamics Ltd",
      amount: "₦350,000",
      dueDate: "Nov 30, 2026",
    },
    render: (d) =>
      invoicing.renderInvoiceCreatedMerchant(
        d as Parameters<typeof invoicing.renderInvoiceCreatedMerchant>[0],
      ),
  },
  {
    id: "invoice_sent_to_client",
    name: "Invoice Sent to Client",
    category: "invoicing",
    description: "Client-facing invoice with breakdown and Paystack payment link",
    defaultSubject:
      "Invoice from Adebayo Tax Consulting (#INV-2026-042) — ₦350,000 due Nov 30, 2026",
    sampleData: {
      merchantName: "Adebayo Tax Consulting Ltd",
      clientName: "Zenith Dynamics Ltd",
      invoiceNumber: "INV-2026-042",
      amount: "₦350,000",
      dueDate: "Nov 30, 2026",
      paymentUrl: "https://taxfiling.com.ng/pay/inv_9812401",
      description: "Q4 Statutory Tax Audit & Transfer Pricing Advisory Services",
    },
    render: (d) =>
      invoicing.renderInvoiceSentToClient(
        d as Parameters<typeof invoicing.renderInvoiceSentToClient>[0],
      ),
  },
  {
    id: "invoice_payment_received",
    name: "Invoice Payment Received",
    category: "invoicing",
    description: "Sent to merchant when client settles an invoice",
    defaultSubject: "Payment Received: ₦350,000 for Invoice #INV-2026-042 🎉",
    sampleData: {
      merchantName: "Adebayo Tax Consulting Ltd",
      clientName: "Zenith Dynamics Ltd",
      invoiceNumber: "INV-2026-042",
      amount: "₦350,000",
      paymentReference: "pstk_tx_09182390",
    },
    render: (d) =>
      invoicing.renderInvoicePaymentReceived(
        d as Parameters<typeof invoicing.renderInvoicePaymentReceived>[0],
      ),
  },
  {
    id: "invoice_payment_receipt_client",
    name: "Client Payment Receipt",
    category: "invoicing",
    description: "Official receipt sent to client after paying invoice online",
    defaultSubject: "Payment Receipt: ₦350,000 for Invoice #INV-2026-042",
    sampleData: {
      clientName: "Zenith Dynamics Ltd",
      merchantName: "Adebayo Tax Consulting Ltd",
      invoiceNumber: "INV-2026-042",
      amount: "₦350,000",
      paymentReference: "pstk_tx_09182390",
      receiptUrl: "https://taxfiling.com.ng/receipt/rcpt_9812401",
    },
    render: (d) =>
      invoicing.renderInvoicePaymentReceiptClient(
        d as Parameters<typeof invoicing.renderInvoicePaymentReceiptClient>[0],
      ),
  },
  {
    id: "invoice_payment_overdue",
    name: "Invoice Overdue Notice",
    category: "invoicing",
    description: "Urgent notice sent when an invoice passes its due date without settlement",
    defaultSubject: "Overdue Notice: Invoice #INV-2026-042 (₦350,000) from Adebayo Tax Consulting",
    sampleData: {
      clientName: "Zenith Dynamics Ltd",
      merchantName: "Adebayo Tax Consulting Ltd",
      invoiceNumber: "INV-2026-042",
      amount: "₦350,000",
      dueDate: "Nov 30, 2026",
      paymentUrl: "https://taxfiling.com.ng/pay/inv_9812401",
    },
    render: (d) =>
      invoicing.renderInvoicePaymentOverdue(
        d as Parameters<typeof invoicing.renderInvoicePaymentOverdue>[0],
      ),
  },
  {
    id: "invoice_reminder",
    name: "Friendly Invoice Reminder",
    category: "invoicing",
    description: "Gentle reminder sent 3 days before invoice due date",
    defaultSubject: "Reminder: Invoice #INV-2026-042 from Adebayo Tax Consulting is due soon",
    sampleData: {
      clientName: "Zenith Dynamics Ltd",
      merchantName: "Adebayo Tax Consulting Ltd",
      invoiceNumber: "INV-2026-042",
      amount: "₦350,000",
      dueDate: "Nov 30, 2026",
      paymentUrl: "https://taxfiling.com.ng/pay/inv_9812401",
    },
    render: (d) =>
      invoicing.renderInvoiceReminder(d as Parameters<typeof invoicing.renderInvoiceReminder>[0]),
  },
  {
    id: "invoice_cancelled",
    name: "Invoice Cancelled Notice",
    category: "invoicing",
    description: "Notice to client when an invoice has been voided",
    defaultSubject: "Notice: Invoice #INV-2026-042 has been cancelled by Adebayo Tax Consulting",
    sampleData: {
      clientName: "Zenith Dynamics Ltd",
      merchantName: "Adebayo Tax Consulting Ltd",
      invoiceNumber: "INV-2026-042",
    },
    render: (d) =>
      invoicing.renderInvoiceCancelled(d as Parameters<typeof invoicing.renderInvoiceCancelled>[0]),
  },

  // F. Tax Filing & Compliance
  {
    id: "tax_filing_started",
    name: "Tax Filing Started",
    category: "taxes",
    description: "Draft created for Personal Income Tax or VAT returns",
    defaultSubject: "Tax Filing Started: Personal Income Tax (PIT) (2026)",
    sampleData: {
      fullName: "Adebayo Olawale",
      filingType: "Personal Income Tax (PIT)",
      taxYear: "2026",
      authority: "Lagos State Internal Revenue Service (LIRS)",
    },
    render: (d) =>
      taxFiling.renderTaxFilingStarted(d as Parameters<typeof taxFiling.renderTaxFilingStarted>[0]),
  },
  {
    id: "tax_filing_submitted",
    name: "Tax Filing Submitted",
    category: "taxes",
    description: "Official submission confirmed with tracking reference",
    defaultSubject: "Submission Confirmation: Personal Income Tax Filed (#LIRS-TX-2026-881)",
    sampleData: {
      fullName: "Adebayo Olawale",
      filingType: "Personal Income Tax (PIT)",
      taxYear: "2026",
      authority: "Lagos State Internal Revenue Service (LIRS)",
      referenceNumber: "LIRS-TX-2026-881",
    },
    render: (d) =>
      taxFiling.renderTaxFilingSubmitted(
        d as Parameters<typeof taxFiling.renderTaxFilingSubmitted>[0],
      ),
  },
  {
    id: "tax_filing_completed",
    name: "Tax Filing Completed & Approved",
    category: "taxes",
    description: "Clearance certificate and assessment notice issued",
    defaultSubject: "Filing Completed: Personal Income Tax (2026) Approved 🎉",
    sampleData: {
      fullName: "Adebayo Olawale",
      filingType: "Personal Income Tax (PIT)",
      taxYear: "2026",
      authority: "Lagos State Internal Revenue Service (LIRS)",
      referenceNumber: "LIRS-TX-2026-881",
    },
    render: (d) =>
      taxFiling.renderTaxFilingCompleted(
        d as Parameters<typeof taxFiling.renderTaxFilingCompleted>[0],
      ),
  },
  {
    id: "tax_filing_correction_required",
    name: "Filing Correction Required",
    category: "taxes",
    description: "Authority clarification requested on deductions or allowances",
    defaultSubject: "Correction Required: Action Needed on Your Personal Income Tax Filing",
    sampleData: {
      fullName: "Adebayo Olawale",
      filingType: "Personal Income Tax",
      taxYear: "2026",
      reason: "Gross income schedule does not match the pension deduction schedule provided.",
    },
    render: (d) =>
      taxFiling.renderTaxFilingCorrectionRequired(
        d as Parameters<typeof taxFiling.renderTaxFilingCorrectionRequired>[0],
      ),
  },
  {
    id: "compliance_doc_uploaded",
    name: "Compliance Document Uploaded",
    category: "taxes",
    description: "Confirmation of regulatory document storage in encrypted vault",
    defaultSubject: "Document Secured: National Driver's License Uploaded",
    sampleData: {
      fullName: "Adebayo Olawale",
      documentType: "National Driver's License",
      documentNumber: "FRSC-DL-9812901",
    },
    render: (d) =>
      taxFiling.renderComplianceDocUploaded(
        d as Parameters<typeof taxFiling.renderComplianceDocUploaded>[0],
      ),
  },
  {
    id: "compliance_doc_expiring",
    name: "Document Expiry Reminder",
    category: "taxes",
    description: "Advance renewal notice for Driver's License, VIN, Passport, or Permits",
    defaultSubject: "Urgent: Your National Driver's License Expires in 14 Days",
    sampleData: {
      fullName: "Adebayo Olawale",
      documentType: "National Driver's License",
      documentNumber: "FRSC-DL-9812901",
      expiryDate: "Dec 15, 2026",
      daysRemaining: 14,
    },
    render: (d) =>
      taxFiling.renderComplianceDocExpiring(
        d as Parameters<typeof taxFiling.renderComplianceDocExpiring>[0],
      ),
  },
  {
    id: "tax_deadline_reminder",
    name: "Statutory Tax Deadline Alert",
    category: "taxes",
    description: "Automatic alert for statutory deadlines under PITA and VAT Act",
    defaultSubject:
      "Compliance Alert: Personal Income Tax (PIT) Annual Returns Due on March 31, 2027 ⏰",
    sampleData: {
      fullName: "Adebayo Olawale",
      deadlineName: "Annual Personal Income Tax (PIT) Returns",
      dueDate: "March 31, 2027",
      description:
        "Under Section 41 of PITA (Cap P8 LFN 2004), every taxable individual must submit their return of income for the preceding year.",
    },
    render: (d) =>
      taxFiling.renderTaxDeadlineReminder(
        d as Parameters<typeof taxFiling.renderTaxDeadlineReminder>[0],
      ),
  },

  // G. Support & Operations
  {
    id: "support_ticket_received",
    name: "Support Request Received",
    category: "support",
    description: "Immediate confirmation sent to user after filing a support ticket",
    defaultSubject:
      "Support Ticket Received: #TK-8910 — Inquiry regarding Landlord TIN verification",
    sampleData: {
      fullName: "Adebayo Olawale",
      ticketId: "TK-8910",
      subject: "Inquiry regarding Landlord TIN verification",
      message:
        "Hello, my landlord is an elderly individual without a corporate TIN. Can I use their National Identification Number (NIN) for my rent relief claim?",
    },
    render: (d) =>
      support.renderSupportTicketReceived(
        d as Parameters<typeof support.renderSupportTicketReceived>[0],
      ),
  },
  {
    id: "support_ticket_reply",
    name: "Support Agent Reply",
    category: "support",
    description: "Response from TaxFilling advisory or technical team",
    defaultSubject: "Response to Ticket #TK-8910: Inquiry regarding Landlord TIN verification",
    sampleData: {
      fullName: "Adebayo Olawale",
      ticketId: "TK-8910",
      subject: "Inquiry regarding Landlord TIN verification",
      agentName: "Ngozi (Tax Advisor)",
      replyMessage:
        "Yes, under the 2024 FCT-IRS guideline, individual landlords without a corporate TIN can be verified using their 11-digit NIN. You can enter their NIN in the Landlord details section.",
    },
    render: (d) =>
      support.renderSupportTicketReply(d as Parameters<typeof support.renderSupportTicketReply>[0]),
  },
  {
    id: "support_ticket_resolved",
    name: "Support Ticket Resolved",
    category: "support",
    description: "Notification that user ticket has been closed",
    defaultSubject:
      "Support Ticket Resolved: #TK-8910 — Inquiry regarding Landlord TIN verification",
    sampleData: {
      fullName: "Adebayo Olawale",
      ticketId: "TK-8910",
      subject: "Inquiry regarding Landlord TIN verification",
    },
    render: (d) =>
      support.renderSupportTicketResolved(
        d as Parameters<typeof support.renderSupportTicketResolved>[0],
      ),
  },
  {
    id: "batch_receipts_processed",
    name: "Batch Receipts Import Complete",
    category: "support",
    description: "Summary report when bulk CSV upload finishes processing",
    defaultSubject: "Batch Processing Complete: 48/50 Receipts Generated",
    sampleData: {
      fullName: "Adebayo Olawale",
      batchId: "BATCH-902",
      totalRecords: 50,
      successfulRecords: 48,
      failedRecords: 2,
    },
    render: (d) =>
      support.renderBatchReceiptsProcessed(
        d as Parameters<typeof support.renderBatchReceiptsProcessed>[0],
      ),
  },
];

export function getEmailTemplate(templateId: string): EmailTemplateDefinition | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === templateId);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(EMAIL_TEMPLATES.map((t) => t.category)));
}
