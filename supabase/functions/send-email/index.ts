import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailPayload {
  to?: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  templateId?: string;
  category?: "transactional" | "marketing" | "security" | "billing";
  userId?: string;
  metadata?: Record<string, unknown>;
  replyTo?: string;

  // Supabase Auth Hook fields
  user?: {
    id?: string;
    email?: string;
    user_metadata?: { full_name?: string; name?: string };
  };
  email_data?: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type?: string; // "signup", "recovery", "invite", "magic_link", "email_change"
  };
}

function renderBrandedAuthEmail(opts: {
  title: string;
  badge: string;
  name: string;
  otp: string;
  purposeText: string;
  expiresText: string;
}): { subject: string; html: string } {
  const subject = `${opts.otp} is your TaxFilling ${opts.title.toLowerCase()}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:24px;background-color:#fcfaf5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#18623f;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(24,98,63,0.15);border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
    <div style="background-color:#18623f;padding:24px 28px;text-align:left;">
      <span style="display:inline-block;background-color:#ffe95c;color:#18623f;font-weight:900;font-size:11px;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">${opts.badge}</span>
      <h1 style="margin:10px 0 0;color:#fcfaf5;font-size:22px;font-weight:800;">${opts.title}</h1>
    </div>
    <div style="padding:28px;line-height:1.6;color:#1f2937;font-size:15px;">
      <p>Hello <strong>${opts.name}</strong>,</p>
      <p>${opts.purposeText}</p>
      <div style="background-color:#fcfaf5;border:2px dashed #18623f;border-radius:12px;padding:22px;text-align:center;margin:24px 0;">
        <div style="font-size:11px;font-weight:800;color:#18623f;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Your One-Time Code</div>
        <div style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:900;letter-spacing:8px;color:#18623f;">${opts.otp}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:8px;">${opts.expiresText}</div>
      </div>
      <p style="font-size:13px;color:#6b7280;">If you did not request this code, please ignore this email or contact <a href="mailto:support@taxfiling.com.ng" style="color:#18623f;font-weight:600;">support@taxfiling.com.ng</a>.</p>
    </div>
    <div style="background-color:#f9f8f5;padding:16px 28px;border-top:1px solid rgba(24,98,63,0.08);font-size:12px;color:#9ca3af;text-align:center;">
      &copy; ${new Date().getFullYear()} TaxFilling Nigeria. Accredited Tax Compliance & Automation Desk.
    </div>
  </div>
</body>
</html>`;
  return { subject, html };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawPayload = (await req.json()) as SendEmailPayload;

    let to = rawPayload.to;
    let subject = rawPayload.subject;
    let html = rawPayload.html;
    let text = rawPayload.text;
    let templateId = rawPayload.templateId || "general_transactional";
    const category = rawPayload.category || "transactional";
    const userId = rawPayload.userId;
    const metadata = rawPayload.metadata || {};
    const replyTo = rawPayload.replyTo;

    // Detect Supabase Auth Hook invocation
    if (rawPayload.email_data && rawPayload.user?.email) {
      const authUser = rawPayload.user;
      const emailData = rawPayload.email_data;
      const recipientEmail = authUser.email;
      const userName =
        authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Taxpayer";
      const otpToken = emailData.token || "------";
      const actionType = emailData.email_action_type || "signup";

      to = recipientEmail;
      templateId = `auth_hook_${actionType}`;

      if (actionType === "recovery") {
        const rendered = renderBrandedAuthEmail({
          title: "Reset Your Password",
          badge: "Security Recovery",
          name: userName,
          otp: otpToken,
          purposeText:
            "We received a request to reset your password. Use the verification code below to authorize your password change:",
          expiresText: "Valid for 15 minutes. Never share this code with anyone.",
        });
        subject = rendered.subject;
        html = rendered.html;
      } else {
        const rendered = renderBrandedAuthEmail({
          title: "Verify Your Email Address",
          badge: "Email Verification",
          name: userName,
          otp: otpToken,
          purposeText:
            "Please enter the 6-digit verification code below to confirm your email and activate your TaxFilling compliance workspace:",
          expiresText: "Valid for 15 minutes. Do not share this code.",
        });
        subject = rendered.subject;
        html = rendered.html;
      }
    }

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, html" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipient = Array.isArray(to) ? to[0] : to;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // If marketing, check if user has unsubscribed
    if (category === "marketing" && recipient) {
      const { data: pref } = await supabaseAdmin
        .from("user_notification_preferences")
        .select("marketing_emails")
        .eq("email", recipient)
        .maybeSingle();

      if (pref && pref.marketing_emails === false) {
        await supabaseAdmin.rpc("log_email", {
          p_recipient: recipient,
          p_template_id: templateId,
          p_subject: subject,
          p_status: "skipped_unsubscribed",
          p_category: category,
          p_user_id: userId ?? null,
          p_provider_message_id: null,
          p_error: "Recipient has unsubscribed from marketing communications",
          p_metadata: metadata,
        });

        return new Response(
          JSON.stringify({
            success: true,
            status: "skipped",
            reason: "User unsubscribed from marketing",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail =
      Deno.env.get("RESEND_FROM_EMAIL") ?? "TaxFilling <notifications@taxfiling.com.ng>";
    const defaultReplyTo = replyTo ?? "TaxFilling Support <support@taxfiling.com.ng>";

    let providerMessageId: string | null = null;
    let deliveryStatus = "sent";
    let deliveryError: string | null = null;

    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text: text ?? html.replace(/<[^>]*>/g, " "),
          reply_to: defaultReplyTo,
          headers: {
            "X-Entity-Ref-ID": templateId,
          },
        }),
      });

      const resendData = (await resendRes.json()) as {
        id?: string;
        error?: { message?: string; name?: string };
      };

      if (!resendRes.ok) {
        deliveryStatus = "failed";
        deliveryError = resendData.error?.message ?? `Resend HTTP error ${resendRes.status}`;
      } else {
        providerMessageId = resendData.id ?? null;
      }
    } else {
      // In development / fallback mode
      deliveryStatus = "simulated";
      providerMessageId = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      console.log(
        `[Email Simulation] Sent template ${templateId} to ${recipient} with subject "${subject}"`,
      );
    }

    // Log to database
    try {
      await supabaseAdmin.rpc("log_email", {
        p_recipient: recipient,
        p_template_id: templateId,
        p_subject: subject,
        p_status: deliveryStatus,
        p_category: category,
        p_user_id: userId ?? null,
        p_provider_message_id: providerMessageId,
        p_error: deliveryError,
        p_metadata: metadata,
      });
    } catch (logErr) {
      console.warn("Could not log email to database:", logErr);
    }

    if (deliveryStatus === "failed") {
      return new Response(JSON.stringify({ success: false, error: deliveryError }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: providerMessageId,
        status: deliveryStatus,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
