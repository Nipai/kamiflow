export const OAUTH_CONFIG = {
  gmail: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    scopes: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    cookieName: "oauth_state_gmail",
  },
  outlook: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    userInfoUrl: "https://graph.microsoft.com/v1.0/me",
    scopes: ["offline_access", "User.Read", "Mail.Read"].join(" "),
    cookieName: "oauth_state_outlook",
  },
} as const;

/**
 * Bepaalt de juiste basis-URL van de applicatie (geschikt voor zowel lokaal, docker als Coolify reverse proxy).
 */
export function getAppBaseUrl(request?: Request): string {
  // 1. Voorkeur voor expliciet geconfigureerde URL in environment variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  // 2. Dynamische detectie op basis van request headers (handig achter Coolify / Caddy / Traefik / Nginx)
  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    const proto =
      request.headers.get("x-forwarded-proto") ||
      (request.url.startsWith("https") ? "https" : "http");

    if (host) {
      return `${proto}://${host}`;
    }

    try {
      const url = new URL(request.url);
      return url.origin;
    } catch {
      // fallback
    }
  }

  // 3. Fallback voor server environments zonder request
  return "http://localhost:3000";
}

/**
 * Genereert de volledige absolute callback URL voor Google of Outlook OAuth.
 */
export function getOAuthCallbackUrl(
  provider: "gmail" | "outlook",
  request?: Request
): string {
  const baseUrl = getAppBaseUrl(request);
  return `${baseUrl}/api/oauth/${provider}/callback`;
}
