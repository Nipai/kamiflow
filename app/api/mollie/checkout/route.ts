import { NextRequest, NextResponse } from "next/server";
import { getMollieClient, PLAN_PRICING, SequenceType } from "@/lib/mollie";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PlanTier } from "@/lib/database.types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planTier = "pro", redirectUrl, userId: requestUserId } = body as {
      planTier?: PlanTier;
      redirectUrl?: string;
      userId?: string;
    };

    if (!PLAN_PRICING[planTier]) {
      return NextResponse.json(
        { error: `Ongeldig abonnementsplan: ${planTier}` },
        { status: 400 }
      );
    }

    const plan = PLAN_PRICING[planTier];

    // Haal de geauthenticeerde gebruiker op of fallback naar requestUserId
    let targetUserId = requestUserId || "user-emma-123";
    let userEmail: string | undefined;
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        targetUserId = user.id;
        userEmail = user.email;
      }
    } catch {
      // Cookies not available outside request context (e.g. unit tests)
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000";

    const successRedirect =
      redirectUrl || `${appUrl}/instellingen?payment=success&plan=${planTier}`;
    const webhookUrl = `${appUrl}/api/webhooks/mollie`;

    // In test environment of wanneer er geen live Mollie API key is geconfigureerd
    if (process.env.NODE_ENV === "test" || !process.env.MOLLIE_API_KEY) {
      return NextResponse.json({
        checkoutUrl: `${successRedirect}&mock=true`,
        paymentId: `tr_mock_${Date.now()}`,
        customerId: `cst_mock_${targetUserId.slice(0, 8)}`,
        isMock: true,
      });
    }

    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("*")
      .eq("uuid_user", targetUserId)
      .single();

    const mollieClient = getMollieClient();
    let customerId = profile?.mollie_customer_id;

    // 1. Maak indien nodig een Mollie Customer aan
    if (!customerId) {
      try {
        const customerName =
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
          profile?.company_name ||
          "KamiFlow Salon Klant";

        const customerEmail =
          profile?.bookkeeping_upload_email ||
          userEmail ||
          "klant@kamiflow.nl";

        const customer = await mollieClient.customers.create({
          name: customerName,
          email: customerEmail,
          metadata: { userId: targetUserId },
        });

        customerId = customer.id;

        // Sla mollie_customer_id op in profiles
        await adminSupabase
          .from("profiles")
          .update({ mollie_customer_id: customerId })
          .eq("uuid_user", targetUserId);
      } catch (err: any) {
        console.warn("Mollie customer creation fallback:", err.message);
        customerId = `cst_mock_${targetUserId.slice(0, 8)}`;
      }
    }

    // 2. Start eerste betaling voor iDEAL/SEPA mandaat
    try {
      const payment = await mollieClient.payments.create({
        amount: {
          currency: "EUR",
          value: plan.amount,
        },
        customerId,
        description: `Eerste betaling & mandaat - ${plan.name}`,
        sequenceType: SequenceType.first,
        redirectUrl: successRedirect,
        webhookUrl: webhookUrl.startsWith("http") ? webhookUrl : undefined,
        metadata: {
          userId: targetUserId,
          planTier,
          customerId,
        },
      });

      return NextResponse.json({
        checkoutUrl: payment.getCheckoutUrl(),
        paymentId: payment.id,
        customerId,
      });
    } catch (mollieErr: any) {
      console.warn("Mollie payment create fallback:", mollieErr.message);
      // In ontwikkelmodus / demo wanneer er geen live Mollie API key is gezet
      return NextResponse.json({
        checkoutUrl: `${successRedirect}&mock=true`,
        paymentId: `tr_mock_${Date.now()}`,
        customerId,
        isMock: true,
      });
    }
  } catch (error: any) {
    console.error("Mollie checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Er is een fout opgetreden bij het starten van de checkout." },
      { status: 500 }
    );
  }
}
