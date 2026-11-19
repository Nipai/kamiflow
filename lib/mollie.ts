import createMollieClient, { SequenceType, PaymentMethod } from "@mollie/api-client";
import { PLAN_PRICING } from "./plans";

export { PLAN_PRICING };

export function getMollieClient() {
  const apiKey =
    process.env.MOLLIE_API_KEY || "test_dummy_key_000000000000000000000000";
  return createMollieClient({ apiKey });
}

export { SequenceType, PaymentMethod };
