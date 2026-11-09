import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  templateId: string;
  category?: "transactional" | "marketing" | "security" | "billing";
  userId?: string;
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as SendEmailPayload;
    const { to, subject, html, text, templateId, category = "transactional", userId, metadata = {}, replyTo } = payload;

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
        // User opted out of marketing
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
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "TaxFilling <notifications@taxfiling.com.ng>";
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

      const resendData = (await resendRes.json()) as { id?: string; error?: { message?: string; name?: string } };

      if (!resendRes.ok) {
        deliveryStatus = "failed";
        deliveryError = resendData.error?.message ?? `Resend HTTP error ${resendRes.status}`;
      } else {
        providerMessageId = resendData.id ?? null;
      }
    } else {
      // In development / test mode when RESEND_API_KEY is not yet in Supabase env secrets
      deliveryStatus = "simulated";
      providerMessageId = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      console.log(`[Email Simulation] Sent template ${templateId} to ${recipient} with subject "${subject}"`);
    }

    // Log to database
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

