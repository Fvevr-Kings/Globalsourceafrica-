"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { OtpInput } from "@/components/OtpInput";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function isEmail(v: string) {
  return v.includes("@");
}

// Passwordless merchant login. Access is decided server-side: the contact must
// match a VERIFIED supplier (set when an admin approves the application).
export function MerchantLoginForm({ denied }: { denied?: boolean }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [step, setStep] = useState<"identity" | "code">("identity");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setError(null);
    setBusy(true);
    const value = contact.trim();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/merchant`;
    const { error } = isEmail(value)
      ? await supabase.auth.signInWithOtp({
          email: value,
          options: { shouldCreateUser: true, emailRedirectTo },
        })
      : await supabase.auth.signInWithOtp({ phone: value, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) return setError(error.message);
    setStep("code");
  }

  async function verifyCode() {
    setError(null);
    setBusy(true);
    const value = contact.trim();
    const { error } = isEmail(value)
      ? await supabase.auth.verifyOtp({ email: value, token: code, type: "email" })
      : await supabase.auth.verifyOtp({ phone: value, token: code, type: "sms" });
    setBusy(false);
    if (error) return setError(error.message);
    router.push("/merchant");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-greenLine bg-white p-6 shadow-sm">
      <h1 className="font-display text-xl font-semibold text-ink">Supplier sign in</h1>
      <p className="mt-1 text-sm text-sub">
        Passwordless. Use the email or phone from your approved application.
      </p>

      {denied && (
        <p className="mt-4 rounded-lg bg-orange/10 px-3 py-2 text-sm text-orangeDark">
          This account isn’t a verified supplier yet. If you’ve applied, an admin
          must approve you first.
        </p>
      )}

      {step === "identity" ? (
        <div className="mt-5 space-y-4">
          <GoogleSignInButton next="/merchant" />

          <div className="flex items-center gap-3 text-xs text-sub">
            <span className="h-px flex-1 bg-greenLine" />
            or use email
            <span className="h-px flex-1 bg-greenLine" />
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (contact.trim()) sendCode();
            }}
          >
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@business.com or +234…"
              className="w-full rounded-lg border border-greenLine px-4 py-3 text-ink focus:border-green focus:outline-none"
              required
            />
            {error && <p className="text-sm text-orangeDark">{error}</p>}
            <button
              type="submit"
              disabled={busy || !contact.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
            >
              <Mail className="h-5 w-5" aria-hidden />
              {busy ? "Sending…" : "Send me a code"}
            </button>
          </form>
        </div>
      ) : (
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.length >= 6) verifyCode();
          }}
        >
          <p className="text-sm text-sub">
            We emailed <span className="font-medium text-ink">{contact}</span>.
            Click the sign-in link, or enter the 6-digit code if your plan sends
            one.
          </p>
          <OtpInput value={code} onChange={setCode} />
          {error && <p className="text-sm text-orangeDark">{error}</p>}
          <button
            type="submit"
            disabled={busy || code.length < 6}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Verify & enter"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              setCode("");
              setStep("identity");
            }}
            className="block w-full text-center text-sm text-sub hover:text-ink"
          >
            Change contact
          </button>
        </form>
      )}
    </div>
  );
}
