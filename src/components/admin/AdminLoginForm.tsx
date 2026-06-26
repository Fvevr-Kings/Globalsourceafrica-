"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Admin login = email + password (Supabase Auth user). The /admin gate then
// checks the staff allowlist server-side, so the signed-in email must also
// exist in the `staff` table to actually reach the dashboard.
export function AdminLoginForm({ denied }: { denied?: boolean }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return setError(error.message);
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-greenLine bg-white p-6 shadow-sm">
      <h1 className="font-display text-xl font-semibold text-ink">Staff sign in</h1>
      <p className="mt-1 text-sm text-sub">
        Only allowlisted staff can access the admin.
      </p>

      {denied && (
        <p className="mt-4 rounded-lg bg-orange/10 px-3 py-2 text-sm text-orangeDark">
          That account isn’t on the staff allowlist.
        </p>
      )}

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim() && password) signIn();
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="staff@email.com"
          autoComplete="email"
          className="w-full rounded-lg border border-greenLine px-4 py-3 text-ink focus:border-green focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-greenLine px-4 py-3 text-ink focus:border-green focus:outline-none"
          required
        />
        {error && <p className="text-sm text-orangeDark">{error}</p>}
        <button
          type="submit"
          disabled={busy || !email.trim() || !password}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </div>
  );
}
