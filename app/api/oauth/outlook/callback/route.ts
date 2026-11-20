import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OAUTH_CONFIG, getOAuthCallbackUrl } from "@/lib/oauth";
import { encryptToken } from "@/lib/crypto";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  // 1. Controleer op OAuth fouten van Microsoft
  if (errorParam) {
    console.error("Microsoft OAuth error ontvangen:", errorParam);
    const redirectUrl = new URL("/koppelingen", request.url);
    redirectUrl.searchParams.set("error", errorParam === "access_denied" ? "outlook_denied" : errorParam);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Valideer de CSRF state cookie
  const storedState = request.cookies.get(OAUTH_CONFIG.outlook.cookieName)?.value;
  if (!state || !storedState || state !== storedState) {
    console.error("Outlook OAuth state mismatch:", { state, storedState });
    const redirectUrl = new URL("/koppelingen", request.url);
    redirectUrl.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Controleer op aanwezigheid van de autorisatiecode
  if (!code) {
    const redirectUrl = new URL("/koppelingen", request.url);
    redirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Controleer of de gebruiker nog ingelogd is
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 5. Wissel authorization code in voor tokens bij Microsoft identity platform
    const callbackUrl = getOAuthCallbackUrl("outlook", request);
    const tokenResponse = await fetch(OAUTH_CONFIG.outlook.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID || "",
        client_secret: process.env.AZURE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: callbackUrl,
        scope: OAUTH_CONFIG.outlook.scopes,
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error("Fout bij uitwisselen Microsoft token:", errBody);
      const redirectUrl = new URL("/koppelingen", request.url);
      redirectUrl.searchParams.set("error", "token_exchange_failed");
      return NextResponse.redirect(redirectUrl);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      const redirectUrl = new URL("/koppelingen", request.url);
      redirectUrl.searchParams.set("error", "missing_access_token");
      return NextResponse.redirect(redirectUrl);
    }

    // 6. Haal het Outlook e-mailadres op via Microsoft Graph /v1.0/me
    const graphResponse = await fetch(OAUTH_CONFIG.outlook.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!graphResponse.ok) {
      console.error("Fout bij ophalen Microsoft Graph profile");
      const redirectUrl = new URL("/koppelingen", request.url);
      redirectUrl.searchParams.set("error", "email_not_found");
      return NextResponse.redirect(redirectUrl);
    }

    const graphData = await graphResponse.json();
    const emailAddress = graphData.mail || graphData.userPrincipalName;

    if (!emailAddress) {
      const redirectUrl = new URL("/koppelingen", request.url);
      redirectUrl.searchParams.set("error", "email_not_found");
      return NextResponse.redirect(redirectUrl);
    }

    // 7. Versleutel tokens met AES-256-GCM via lib/crypto.ts
    const encryptedAccessToken = encryptToken(access_token);
    const encryptedRefreshToken = refresh_token ? encryptToken(refresh_token) : null;
    const tokenExpiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;
    const now = new Date().toISOString();

    // 8. Upsert in emailconnection
    const { data: existingConnection } = await supabase
      .from("emailconnection")
      .select("id, provider_refresh_token")
      .eq("user_id", user.id)
      .eq("email_provider", "outlook")
      .eq("email_address", emailAddress)
      .maybeSingle();

    if (existingConnection) {
      const finalRefreshToken = encryptedRefreshToken || existingConnection.provider_refresh_token;

      const { error: updateError } = await supabase
        .from("emailconnection")
        .update({
          is_active: true,
          provider_auth_token: encryptedAccessToken,
          provider_refresh_token: finalRefreshToken,
          token_expires_at: tokenExpiresAt,
          provider_auth_token_last_refresh: now,
        })
        .eq("id", existingConnection.id);

      if (updateError) {
        console.error("Database update fout bij emailconnection:", updateError);
        const redirectUrl = new URL("/koppelingen", request.url);
        redirectUrl.searchParams.set("error", "database_error");
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      const { error: insertError } = await supabase.from("emailconnection").insert({
        user_id: user.id,
        email_address: emailAddress,
        email_provider: "outlook",
        is_active: true,
        provider_auth_token: encryptedAccessToken,
        provider_refresh_token: encryptedRefreshToken,
        token_expires_at: tokenExpiresAt,
        provider_auth_token_last_refresh: now,
      });

      if (insertError) {
        console.error("Database insert fout bij emailconnection:", insertError);
        const redirectUrl = new URL("/koppelingen", request.url);
        redirectUrl.searchParams.set("error", "database_error");
        return NextResponse.redirect(redirectUrl);
      }
    }

    // 9. Redirect naar /koppelingen met succes indicator en wis state cookie
    const redirectUrl = new URL("/koppelingen", request.url);
    redirectUrl.searchParams.set("connected", "outlook");

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete(OAUTH_CONFIG.outlook.cookieName);
    return response;
  } catch (err) {
    console.error("Onverwachte fout in Outlook OAuth callback:", err);
    const redirectUrl = new URL("/koppelingen", request.url);
    redirectUrl.searchParams.set("error", "oauth_callback_exception");
    return NextResponse.redirect(redirectUrl);
  }
}
