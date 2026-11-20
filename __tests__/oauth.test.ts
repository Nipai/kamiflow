import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { getAppBaseUrl, getOAuthCallbackUrl, OAUTH_CONFIG } from "@/lib/oauth";
import { GET as gmailConnectGET } from "@/app/api/oauth/gmail/connect/route";
import { GET as gmailCallbackGET } from "@/app/api/oauth/gmail/callback/route";
import { GET as outlookConnectGET } from "@/app/api/oauth/outlook/connect/route";
import { GET as outlookCallbackGET } from "@/app/api/oauth/outlook/callback/route";
import { POST as disconnectPOST } from "@/app/api/oauth/disconnect/route";
import { decryptToken } from "@/lib/crypto";

// Mock Supabase Server Client
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}));

describe("OAuth Base URL & Configuration Helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("resolves base URL from process.env.NEXT_PUBLIC_APP_URL when present", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://kamiflow.app/";
    expect(getAppBaseUrl()).toBe("https://kamiflow.app");
    expect(getOAuthCallbackUrl("gmail")).toBe("https://kamiflow.app/api/oauth/gmail/callback");
    expect(getOAuthCallbackUrl("outlook")).toBe("https://kamiflow.app/api/oauth/outlook/callback");
  });

  it("resolves base URL from reverse proxy headers (x-forwarded-host & x-forwarded-proto)", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.APP_URL;

    const req = new NextRequest("http://127.0.0.1:3000/api/oauth/gmail/connect", {
      headers: {
        "x-forwarded-host": "kamiflow.salon",
        "x-forwarded-proto": "https",
      },
    });

    expect(getAppBaseUrl(req)).toBe("https://kamiflow.salon");
    expect(getOAuthCallbackUrl("gmail", req)).toBe("https://kamiflow.salon/api/oauth/gmail/callback");
    expect(getOAuthCallbackUrl("outlook", req)).toBe("https://kamiflow.salon/api/oauth/outlook/callback");
  });
});

describe("Gmail OAuth Routes", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENCRYPTION_KEY: "5605357b9417a302688caff6c01c5a64bf7387f8aabfdcc1c0bf26a417cfb37a",
      GOOGLE_CLIENT_ID: "mock-google-client-id",
      GOOGLE_CLIENT_SECRET: "mock-google-client-secret",
    };
    mockGetUser.mockReset();
    mockFrom.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("connect: redirects to login if user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest("http://localhost:3000/api/oauth/gmail/connect");
    const res = await gmailConnectGET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("/login");
    expect(location).toContain("redirectedFrom=%2Fkoppelingen");
  });

  it("connect: redirects to Google OAuth2 with correct scopes, prompt, and sets state cookie", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "test@kamiflow.nl" } },
    });

    const req = new NextRequest("http://localhost:3000/api/oauth/gmail/connect");
    const res = await gmailConnectGET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("https://accounts.google.com/o/oauth2/v2/auth");
    expect(location).toContain("client_id=mock-google-client-id");
    expect(location).toContain("access_type=offline");
    expect(location).toContain("prompt=consent");
    expect(location).toContain(encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly"));
    expect(location).toContain(encodeURIComponent("https://www.googleapis.com/auth/userinfo.email"));

    // State cookie set in headers
    const setCookie = res.headers.get("set-cookie") || "";
    expect(setCookie).toContain(OAUTH_CONFIG.gmail.cookieName);
  });

  it("callback: redirects with invalid_state error if state is missing or mismatched", async () => {
    const req = new NextRequest("http://localhost:3000/api/oauth/gmail/callback?code=abc&state=wrong", {
      headers: {
        cookie: `${OAUTH_CONFIG.gmail.cookieName}=expected_state`,
      },
    });

    const res = await gmailCallbackGET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/koppelingen?error=invalid_state");
  });

  it("callback: exchanges code, fetches email, encrypts tokens, upserts to emailconnection", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "salon@example.nl" } },
    });

    // Mock fetch for Google token endpoint and userinfo endpoint
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("oauth2.googleapis.com/token")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: "mock-google-access-token",
              refresh_token: "mock-google-refresh-token",
              expires_in: 3600,
            }),
        });
      }
      if (url.includes("userinfo")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              email: "inkoop@jouwsalon.nl",
            }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
    vi.stubGlobal("fetch", fetchMock);

    // Mock Supabase database calls
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      }),
    });

    let insertedPayload: any = null;
    const mockInsert = vi.fn().mockImplementation((payload) => {
      insertedPayload = payload;
      return Promise.resolve({ error: null });
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });

    const validState = "secret_state_123";
    const req = new NextRequest(
      `http://localhost:3000/api/oauth/gmail/callback?code=mock_code&state=${validState}`,
      {
        headers: {
          cookie: `${OAUTH_CONFIG.gmail.cookieName}=${validState}`,
        },
      }
    );

    const res = await gmailCallbackGET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/koppelingen?connected=gmail");

    expect(insertedPayload).not.toBeNull();
    expect(insertedPayload.user_id).toBe("user-123");
    expect(insertedPayload.email_address).toBe("inkoop@jouwsalon.nl");
    expect(insertedPayload.email_provider).toBe("gmail");
    expect(insertedPayload.is_active).toBe(true);

    // Tokens must be encrypted with AES-256-GCM
    expect(insertedPayload.provider_auth_token).not.toBe("mock-google-access-token");
    expect(decryptToken(insertedPayload.provider_auth_token)).toBe("mock-google-access-token");
    expect(decryptToken(insertedPayload.provider_refresh_token)).toBe("mock-google-refresh-token");
  });
});

describe("Outlook OAuth Routes", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENCRYPTION_KEY: "5605357b9417a302688caff6c01c5a64bf7387f8aabfdcc1c0bf26a417cfb37a",
      AZURE_CLIENT_ID: "mock-azure-client-id",
      AZURE_CLIENT_SECRET: "mock-azure-client-secret",
    };
    mockGetUser.mockReset();
    mockFrom.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("connect: redirects to login if unauthenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest("http://localhost:3000/api/oauth/outlook/connect");
    const res = await outlookConnectGET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login?redirectedFrom=%2Fkoppelingen");
  });

  it("connect: redirects to Microsoft 365 OAuth with offline_access, Mail.Read, and sets state cookie", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-456", email: "owner@salon.nl" } },
    });

    const req = new NextRequest("http://localhost:3000/api/oauth/outlook/connect");
    const res = await outlookConnectGET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("login.microsoftonline.com/common/oauth2/v2.0/authorize");
    expect(location).toContain("client_id=mock-azure-client-id");
    expect(location).toContain("prompt=consent");
    expect(location).toMatch(/scope=offline_access(\+|%20)User\.Read(\+|%20)Mail\.Read/);

    const setCookie = res.headers.get("set-cookie") || "";
    expect(setCookie).toContain(OAUTH_CONFIG.outlook.cookieName);
  });

  it("callback: exchanges token, fetches Graph email, encrypts tokens, upserts row", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-456", email: "owner@salon.nl" } },
    });

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("microsoftonline.com")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: "mock-azure-access-token",
              refresh_token: "mock-azure-refresh-token",
              expires_in: 3600,
            }),
        });
      }
      if (url.includes("graph.microsoft.com")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              mail: "administratie@jouwsalon.nl",
              userPrincipalName: "admin@jouwsalon.onmicrosoft.com",
            }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
    vi.stubGlobal("fetch", fetchMock);

    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      }),
    });

    let insertedPayload: any = null;
    const mockInsert = vi.fn().mockImplementation((payload) => {
      insertedPayload = payload;
      return Promise.resolve({ error: null });
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });

    const validState = "outlook_valid_state_456";
    const req = new NextRequest(
      `http://localhost:3000/api/oauth/outlook/callback?code=ms_code&state=${validState}`,
      {
        headers: {
          cookie: `${OAUTH_CONFIG.outlook.cookieName}=${validState}`,
        },
      }
    );

    const res = await outlookCallbackGET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/koppelingen?connected=outlook");

    expect(insertedPayload).not.toBeNull();
    expect(insertedPayload.user_id).toBe("user-456");
    expect(insertedPayload.email_address).toBe("administratie@jouwsalon.nl");
    expect(insertedPayload.email_provider).toBe("outlook");
    expect(insertedPayload.is_active).toBe(true);
    expect(decryptToken(insertedPayload.provider_auth_token)).toBe("mock-azure-access-token");
    expect(decryptToken(insertedPayload.provider_refresh_token)).toBe("mock-azure-refresh-token");
  });
});

describe("Disconnect Route (/api/oauth/disconnect)", () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockFrom.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest("http://localhost:3000/api/oauth/disconnect", {
      method: "POST",
      body: JSON.stringify({ id: "conn-123" }),
    });

    const res = await disconnectPOST(req);
    expect(res.status).toBe(401);
  });

  it("deletes the emailconnection row when authenticated", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
    });

    const mockEqUser = vi.fn().mockResolvedValue({ error: null });
    const mockEqId = vi.fn().mockReturnValue({ eq: mockEqUser });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEqId });

    mockFrom.mockReturnValue({
      delete: mockDelete,
    });

    const req = new NextRequest("http://localhost:3000/api/oauth/disconnect", {
      method: "POST",
      body: JSON.stringify({ id: "conn-123" }),
    });

    const res = await disconnectPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ success: true });
    expect(mockEqId).toHaveBeenCalledWith("id", "conn-123");
    expect(mockEqUser).toHaveBeenCalledWith("user_id", "user-123");
  });
});
