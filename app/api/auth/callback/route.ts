import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
      console.error("Exchange code for session failed:", error.message);
    } catch (err) {
      console.error("Auth callback exception:", err);
    }
  }

  // If code is missing or exchange failed, redirect back to login with notice
  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", requestUrl.origin));
}
