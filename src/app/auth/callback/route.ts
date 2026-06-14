import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Magic-link / OTP callback. On Supabase's free tier the default email sends a
 * sign-in LINK (no code), so this route turns that link into a session:
 *   - PKCE flow: ?code=… → exchangeCodeForSession
 *   - token_hash flow: ?token_hash=…&type=… → verifyOtp
 * Then redirects to ?next (defaults to "/"). Used by both admin login and buyer
 * checkout via the emailRedirectTo we pass to signInWithOtp.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const success = `${origin}${next}`;
  const failure = next.startsWith("/merchant")
    ? `${origin}/merchant/login?error=link`
    : `${origin}/admin/login?error=link`;

  let response = NextResponse.redirect(success);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.redirect(success);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let ok = false;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash: tokenHash,
    });
    ok = !error;
  }

  return ok ? response : NextResponse.redirect(failure);
}
