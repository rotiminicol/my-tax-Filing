import { supabase } from "@/integrations/supabase/client";
import { getEmailTemplate } from "./emailRegistry";

export interface SendAppEmailOptions {
  templateId: string;
  to: string;
  userId?: string;
  variables: Record<string, unknown>;
  customSubject?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
}

/**
 * Dispatch an email through the Supabase Edge Function with Resend
 */
export async function sendAppEmail(options: SendAppEmailOptions): Promise<SendEmailResult> {
  const { templateId, to, userId, variables, customSubject, replyTo } = options;

  const tpl = getEmailTemplate(templateId);
  if (!tpl) {
    console.error(`Email template "${templateId}" not found in registry`);
    return { success: false, error: `Template ${templateId} not found` };
  }

  const { subject: defaultSubject, html } = tpl.render(variables);
  const subject = customSubject || defaultSubject;

  const supabaseUrl =
    (import.meta.env.VITE_SUPABASE_URL as string) ||
    (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined);
  const anonKey =
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
    (typeof process !== "undefined"
      ? process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
      : undefined);

  if (!supabaseUrl || !anonKey) {
    console.warn("Supabase environment variables not found; simulating email dispatch");
    return { success: true, messageId: `mock_${Date.now()}`, status: "simulated" };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        templateId,
        category: tpl.category,
        userId,
        replyTo,
        metadata: { variables, sentAt: new Date().toISOString() },
      }),
    });

    const data = (await res.json()) as {
      success?: boolean;
      messageId?: string;
      status?: string;
      error?: string;
    };

    if (!res.ok || !data.success) {
      console.warn(
        `Email delivery notice: ${data.error || "Edge function response"} (Status: ${res.status})`,
      );
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    return {
      success: true,
      messageId: data.messageId,
      status: data.status,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("Email service dispatch fallback:", msg);
    return { success: false, error: msg };
  }
}

// ----------------- Trigger Helpers -----------------

export async function sendWelcomeEmail(user: { email: string; fullName?: string; id?: string }) {
  return sendAppEmail({
    templateId: "welcome",
    to: user.email,
    userId: user.id,
    variables: { fullName: user.fullName, email: user.email },
  });
}

export async function sendVerificationOtpEmail(email: string, otp: string, fullName?: string) {
  return sendAppEmail({
    templateId: "verify_email_otp",
    to: email,
    variables: { fullName, otp, expiresInMinutes: 10 },
  });
}

export async function sendResendVerificationOtpEmail(
  email: string,
  otp: string,
  fullName?: string,
) {
  return sendAppEmail({
    templateId: "resend_verification_otp",
    to: email,
    variables: { fullName, otp, expiresInMinutes: 10 },
  });
}

export async function sendPasswordResetOtpEmail(email: string, otp: string, fullName?: string) {
  return sendAppEmail({
    templateId: "password_reset_otp",
    to: email,
    variables: { fullName, otp },
  });
}

export async function sendPasswordChangedEmail(email: string, fullName?: string) {
  return sendAppEmail({
    templateId: "password_changed",
    to: email,
    variables: { fullName, timestamp: new Date().toUTCString() },
  });
}

export async function sendSubscriptionStartedEmail(params: {
  email: string;
  fullName?: string;
  userId?: string;
  plan: string;
  amount: string;
  cycle: string;
  reference?: string;
}) {
  return sendAppEmail({
    templateId: "subscription_started",
    to: params.email,
    userId: params.userId,
    variables: params,
  });
}

export async function sendSupportTicketConfirmation(params: {
  email: string;
  fullName?: string;
  ticketId: string;
  subject: string;
  message: string;
}) {
  return sendAppEmail({
    templateId: "support_ticket_received",
    to: params.email,
    variables: params,
  });
}

export async function sendSupportTeamInquiryAlert(params: {
  ticketId: string;
  fullName: string;
  email: string;
  phone?: string;
  clientType: string;
  category?: string;
  subject: string;
  message: string;
  submittedAt?: string;
  targetSupportEmail?: string;
}) {
  const toEmail = params.targetSupportEmail || "hello@taxfiling.com.ng";
  return sendAppEmail({
    templateId: "support_team_alert",
    to: toEmail,
    replyTo: params.email,
    customSubject: `[Inquiry #${params.ticketId}] ${params.subject} — ${params.fullName}`,
    variables: params,
  });
}
