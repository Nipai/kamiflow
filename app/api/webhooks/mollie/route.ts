import { NextRequest, NextResponse } from "next/server";
import { getMollieClient, PLAN_PRICING } from "@/lib/mollie";
import { createAdminClient } from "@/lib/supabase/admin";
import { PlanTier, SubscriptionStatus } from "@/lib/database.types";

export async function POST(req: NextRequest) {
  try {
    let paymentId: string | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      paymentId = (formData.get("id") as string) || null;
    } else {
      const json = await req.json().catch(() => ({}));
      paymentId = json.id || null;
    }

    if (!paymentId) {
      return NextResponse.json({ error: "Geen Mollie payment ID ontvangen" }, { status: 400 });
    }

    const mollieClient = getMollieClient();
    const adminSupabase = createAdminClient();

    let payment: any;
    try {
      payment = await mollieClient.payments.get(paymentId);
    } catch (err: any) {
      console.error("Mollie payment retrieval failed:", err.message);
      return NextResponse.json({ error: "Betaling niet gevonden bij Mollie" }, { status: 404 });
    }

    const metadata = (payment.metadata || {}) as {
      userId?: string;
      planTier?: PlanTier;
    };

    const userId = metadata.userId;
    const planTier: PlanTier = metadata.planTier || "pro";

    if (!userId) {
      console.warn("Mollie payment missing userId in metadata:", paymentId);
      return new Response("OK - No userId in metadata", { status: 200 });
    }

    // Controleer de betaalstatus
    if (payment.status === "paid") {
      // 1. Eerste betaling (sequenceType === 'first'): Mandaat is verkregen, start Subscription
      if (payment.sequenceType === "first") {
        // IDEMPOTENCY CHECK: Controleer eerst of profiles.mollie_subscription_id al bestaat
        const { data: existingProfile, error: profileErr } = await adminSupabase
          .from("profiles")
          .select("uuid_user, mollie_subscription_id, subscription_status")
          .eq("uuid_user", userId)
          .single();

        if (profileErr) {
          console.error("Fout bij ophalen profiel voor webhook:", profileErr);
        }

        if (existingProfile?.mollie_subscription_id) {
          console.log(
            `Idempotency check: Profiel ${userId} heeft reeds subscription ${existingProfile.mollie_subscription_id}. Geen dubbele subscription aanmaken.`
          );
          return new Response("OK - Subscription already active", { status: 200 });
        }

        const plan = PLAN_PRICING[planTier] || PLAN_PRICING.pro;
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.VERCEL_URL ||
          "http://localhost:3000";

        // Maak de periodieke Mollie Subscription aan
        let subscriptionId: string;
        try {
          const subscription = await mollieClient.customerSubscriptions.create({
            customerId: payment.customerId,
            amount: {
              currency: "EUR",
              value: plan.amount,
            },
            interval: "1 month",
            description: `${plan.name} (Maandelijkse incasso)`,
            webhookUrl: `${appUrl}/api/webhooks/mollie`,
            metadata: {
              userId,
              planTier,
            },
          });
          subscriptionId = subscription.id;
        } catch (subErr: any) {
          console.error("Mollie subscription create failed:", subErr);
          subscriptionId = `sub_fallback_${Date.now()}`;
        }

        // Bereken verloopdatum (1 maand vanaf nu)
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

        // Update profiel in Supabase via service role client
        const { error: updateErr } = await adminSupabase
          .from("profiles")
          .update({
            mollie_subscription_id: subscriptionId,
            subscription_status: "active" as SubscriptionStatus,
            plan_tier: planTier,
            current_period_end: currentPeriodEnd.toISOString(),
          })
          .eq("uuid_user", userId);

        if (updateErr) {
          console.error("Fout bij bijwerken profiel na Mollie subscription:", updateErr);
        }
      } else if (payment.sequenceType === "recurring") {
        // Periodieke verlenging via Mollie Subscription
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

        await adminSupabase
          .from("profiles")
          .update({
            subscription_status: "active" as SubscriptionStatus,
            current_period_end: currentPeriodEnd.toISOString(),
          })
          .eq("uuid_user", userId);
      }
    } else if (payment.status === "failed" || payment.status === "canceled" || payment.status === "expired") {
      // Betaling mislukt of geannuleerd
      await adminSupabase
        .from("profiles")
        .update({
          subscription_status: "past_due" as SubscriptionStatus,
        })
        .eq("uuid_user", userId);
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new Response(`Webhook Error: ${error?.message || "Onbekende fout"}`, {
      status: 500,
    });
  }
}
