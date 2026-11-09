import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reference, userId, plan, billingCycle } = (await req.json()) as {
      reference: string;
      userId: string;
      plan: string;
      billingCycle: string;
    };

    if (!reference || !userId || !plan) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");

    let amountKobo = 0;

    // Verify with Paystack if secret key is present
    if (paystackSecret) {
      const paystackRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
        },
      );

      const paystackData = (await paystackRes.json()) as {
        status: boolean;
        data?: { status: string; amount: number; reference: string };
        message?: string;
      };

      if (!paystackData.status || paystackData.data?.status !== "success") {
        return new Response(
          JSON.stringify({
            error: `Payment not verified: ${paystackData.message ?? paystackData.data?.status ?? "unknown"}`,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      amountKobo = paystackData.data.amount;
    } else {
      // In development / demo when secret key is not yet set in Supabase secrets
      console.warn("PAYSTACK_SECRET_KEY not set; using fallback test verification");
      amountKobo = plan === "premium" ? 4500000 : 1250000;
    }

    // Activate subscription via Supabase service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: result, error } = await supabaseAdmin.rpc("activate_subscription_after_payment", {
      p_user_id: userId,
      p_plan: plan,
      p_billing_cycle: billingCycle,
      p_provider_reference: reference,
      p_amount_kobo: amountKobo,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, plan, billingCycle, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

