import type { PlanBillingCycle, PlanTier } from "@/store/auth";

export const PLAN_KOBO_AMOUNTS: Record<string, Record<string, number>> = {
  deluxe: { monthly: 1_250_000, annual: 12_000_000 },
  premium: { monthly: 4_500_000, annual: 43_200_000 },
  free: { monthly: 0, annual: 0 },
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.PaystackPop) return resolve();

    const existingScript = document.getElementById("paystack-inline-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Paystack SDK")),
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack payment script"));
    document.body.appendChild(script);
  });
}

export interface PaystackCheckoutOptions {
  email: string;
  userId: string;
  plan: PlanTier;
  billingCycle: PlanBillingCycle;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  onError?: (err: Error) => void;
}

export async function checkoutWithPaystack({
  email,
  userId,
  plan,
  billingCycle,
  onSuccess,
  onClose,
  onError,
}: PaystackCheckoutOptions) {
  try {
    await loadPaystackScript();

    const amountKobo = PLAN_KOBO_AMOUNTS[plan]?.[billingCycle] ?? 0;
    const publicKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || "pk_test_sample";
    const ref = `tax_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    if (!window.PaystackPop) {
      throw new Error("Paystack SDK could not be initialized");
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amountKobo,
      currency: "NGN",
      ref,
      metadata: {
        custom_fields: [
          { display_name: "Plan", variable_name: "plan", value: plan },
          { display_name: "Billing Cycle", variable_name: "billing_cycle", value: billingCycle },
          { display_name: "User ID", variable_name: "user_id", value: userId },
        ],
      },
      callback: (response) => {
        onSuccess(response.reference);
      },
      onClose: () => {
        onClose?.();
      },
    });

    handler.openIframe();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    onError?.(error);
  }
}

