import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { OAUTH_CONFIG, getOAuthCallbackUrl } from "@/lib/oauth";

export async function GET(request: NextRequest) {
  // 1. Controleer of de gebruiker is ingelogd in Supabase
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", "/koppelingen");
    return NextResponse.redirect(loginUrl);
  }

  // 2. Genereer een cryptografisch veilige CSRF state parameter
  const state = crypto.randomBytes(32).toString("hex");

  // 3. Bouw Google OAuth2 autorisatie URL
  const callbackUrl = getOAuthCallbackUrl("gmail", request);
  const authUrl = new URL(OAUTH_CONFIG.gmail.authUrl);
  authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID || "");
  authUrl.searchParams.set("redirect_uri", callbackUrl);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", OAUTH_CONFIG.gmail.scopes);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  // 4. Stuur door naar Google en sla de state op in een veilige SameSite=Lax cookie
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set(OAUTH_CONFIG.gmail.cookieName, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minuten geldig
  });

  return response;
}
