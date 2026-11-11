import { createServerFn } from "@tanstack/react-start";

export interface SendEmailServerPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId: string;
  category?: string;
  userId?: string;
  replyTo?: string;
  metadata?: Record<string, unknown>;
}

export const sendEmailServerFn = createServerFn({ method: "POST" })
  .validator((data: SendEmailServerPayload) => data)
  .handler(async ({ data }) => {
    const { to, subject, html, text, templateId, replyTo } = data;

    const resendApiKey =
      process.env.RESEND_API_KEY ||
      (typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env.VITE_RESEND_API_KEY as string)
        : undefined);

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      (typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env.VITE_RESEND_FROM_EMAIL as string)
        : undefined) ||
      "TaxFilling <notifications@taxfiling.com.ng>";

    const defaultReplyTo = replyTo || "TaxFilling Support <support@taxfiling.com.ng>";

    if (resendApiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to],
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, " "),
            reply_to: defaultReplyTo,
            headers: {
              "X-Entity-Ref-ID": templateId,
            },
          }),
        });

        const resData = (await res.json()) as { id?: string; error?: { message?: string } };
        if (res.ok && resData.id) {
          return { success: true, messageId: resData.id, status: "sent" };
        } else {
          console.warn("[Resend Server Notice]", resData);
          return { success: false, error: resData.error?.message || `HTTP ${res.status}` };
        }
      } catch (err) {
        console.warn("[Resend Dispatch Notice]", err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    }

    // In local development / fallback mode when RESEND_API_KEY is not yet populated
    console.log(
      `[Email Dispatched via Resend System] Template: ${templateId} -> ${to} ("${subject}")`,
    );
    return {
      success: true,
      messageId: `resend_sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      status: "simulated",
    };
  });
