import { describe, it, expect, vi } from "vitest";
import { POST as checkoutRoute } from "@/app/api/mollie/checkout/route";
import { POST as webhookRoute } from "@/app/api/webhooks/mollie/route";
import { NextRequest } from "next/server";

describe("Mollie API Routes", () => {
  describe("POST /api/mollie/checkout", () => {
    it("rejects unknown plan tiers with 400", async () => {
      const req = new NextRequest("http://localhost:3000/api/mollie/checkout", {
        method: "POST",
        body: JSON.stringify({ planTier: "invalid_plan" }),
      });

      const res = await checkoutRoute(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toMatch(/Ongeldig abonnementsplan/i);
    });

    it("generates a checkout response for pro tier", async () => {
      const req = new NextRequest("http://localhost:3000/api/mollie/checkout", {
        method: "POST",
        body: JSON.stringify({ planTier: "pro", userId: "user-test-123" }),
      });

      const res = await checkoutRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.checkoutUrl).toBeDefined();
      expect(json.customerId).toBeDefined();
    });
  });

  describe("POST /api/webhooks/mollie", () => {
    it("returns 400 when no payment ID is provided", async () => {
      const req = new NextRequest("http://localhost:3000/api/webhooks/mollie", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await webhookRoute(req);
      expect(res.status).toBe(400);
    });
  });
});
