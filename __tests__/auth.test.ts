import { describe, it, expect, vi } from "vitest";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";
import { GET as authCallbackGET } from "@/app/api/auth/callback/route";

describe("Route-beveiliging & Middleware (Stap 1)", () => {
  it("allows requests to pass through gracefully when NEXT_PUBLIC_SUPABASE_URL is not set or placeholder", async () => {
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
  });

  it("leaves public routes such as / and webhooks accessible", async () => {
    const publicReq = new NextRequest("http://localhost:3000/");
    const res = await middleware(publicReq);
    expect(res.status).toBe(200);

    const webhookReq = new NextRequest("http://localhost:3000/api/webhooks/mollie");
    const webhookRes = await middleware(webhookReq);
    expect(webhookRes.status).toBe(200);
  });
});

describe("Auth Callback Route (Stap 2)", () => {
  it("redirects to login with error parameter when code is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/callback");
    const res = await authCallbackGET(req);
    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/login?error=auth_callback_failed");
  });
});
