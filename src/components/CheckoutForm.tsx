"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart";
import { resolveUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { OtpInput } from "./OtpInput";
import { placeOrder } from "@/app/checkout/actions";

type Step = "identity" | "code" | "shipping";

function isEmail(v: string) {
  return v.includes("@");
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear, ready } = useCart();
  const supabase = createSupabaseBrowserClient();

  const [step, setStep] = useState<Step>("identity");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shipping, setShipping] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  });

  if (ready && items.length === 0) {
    return (
      <p className="py-16 text-center text-sub">
        Your cart is empty — add a product before checking out.
      </p>
    );
  }

  // Step 1 — send passwordless code (OTP / magic link). No password, ever.
  async function sendCode() {
    setError(null);
    setBusy(true);
    const value = contact.trim();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/checkout`;
    const { error } = isEmail(value)
      ? await supabase.auth.signInWithOtp({
          email: value,
          options: { shouldCreateUser: true, emailRedirectTo },
        })
      : await supabase.auth.signInWithOtp({
          phone: value,
          options: { shouldCreateUser: true },
        });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep("code");
  }

  // Step 2 — verify the code; the silent account attaches on success.
  async function verifyCode() {
    setError(null);
    setBusy(true);
    const value = contact.trim();
    const { error } = isEmail(value)
      ? await supabase.auth.verifyOtp({
          email: value,
          token: code,
          type: "email",
        })
      : await supabase.auth.verifyOtp({
          phone: value,
          token: code,
          type: "sms",
        });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setShipping((s) => ({ ...s, name: s.name }));
    setStep("shipping");
  }

  // Step 3 — collect shipping + place order (payment stubbed).
  async function pay() {
    setError(null);
    setBusy(true);
    const result = await placeOrder({
      items: items.map((it) => ({ productId: it.productId, qty: it.qty })),
      shippingName: shipping.name,
      shippingAddress: {
        line1: shipping.line1,
        line2: shipping.line2 || undefined,
        city: shipping.city,
        region: shipping.region || undefined,
        postalCode: shipping.postalCode || undefined,
        country: shipping.country,
      },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    clear();
    router.push(`/order/${result.orderId}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-greenLine bg-white p-6">
        <Stepper step={step} />

        {step === "identity" && (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (contact.trim()) sendCode();
            }}
          >
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="contact">
                Email or phone
              </label>
              <input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="you@email.com or +234…"
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-3 text-ink focus:border-green focus:outline-none"
                required
              />
              <p className="mt-1 text-xs text-sub">
                We send a one-time code. No password — your account is created
                quietly in the background.
              </p>
            </div>
            {error && <p className="text-sm text-orangeDark">{error}</p>}
            <button
              type="submit"
              disabled={busy || !contact.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
            >
              <Mail className="h-5 w-5" aria-hidden />
              {busy ? "Sending…" : "Send me a code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.length >= 6) verifyCode();
            }}
          >
            <p className="text-sm text-sub">
              Enter the code we sent to{" "}
              <span className="font-medium text-ink">{contact}</span>.
            </p>
            <OtpInput value={code} onChange={setCode} />
            {error && <p className="text-sm text-orangeDark">{error}</p>}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={busy || code.length < 6}
                className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Verify"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode("");
                  setStep("identity");
                }}
                className="text-sm text-sub hover:text-ink"
              >
                Change contact
              </button>
            </div>
          </form>
        )}

        {step === "shipping" && (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              pay();
            }}
          >
            <Field label="Full name" value={shipping.name} onChange={(v) => setShipping((s) => ({ ...s, name: v }))} required />
            <Field label="Address line 1" value={shipping.line1} onChange={(v) => setShipping((s) => ({ ...s, line1: v }))} required />
            <Field label="Address line 2 (optional)" value={shipping.line2} onChange={(v) => setShipping((s) => ({ ...s, line2: v }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" value={shipping.city} onChange={(v) => setShipping((s) => ({ ...s, city: v }))} required />
              <Field label="Region / State" value={shipping.region} onChange={(v) => setShipping((s) => ({ ...s, region: v }))} />
              <Field label="Postal code" value={shipping.postalCode} onChange={(v) => setShipping((s) => ({ ...s, postalCode: v }))} />
              <Field label="Country" value={shipping.country} onChange={(v) => setShipping((s) => ({ ...s, country: v }))} required />
            </div>
            {error && <p className="text-sm text-orangeDark">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
            >
              {busy ? "Placing order…" : `Pay ${formatPrice(subtotal)}`}
            </button>
            <p className="text-center text-xs text-sub">
              Payment is processed securely. (Phase 1: payment is stubbed — your
              order is recorded immediately.)
            </p>
          </form>
        )}
      </div>

      {/* Order summary */}
      <aside className="h-fit rounded-2xl border border-greenLine bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Your order</h2>
        <ul className="mt-4 space-y-3">
          {items.map((it) => {
            const unit = resolveUnitPrice(it.retailPriceUsd, it.tiers, it.qty);
            return (
              <li key={it.productId} className="flex justify-between text-sm">
                <span className="text-sub">
                  {it.name} × {it.qty}
                </span>
                <span className="font-medium text-ink">
                  {formatPrice(unit * it.qty)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t border-greenLine pt-3 text-sm">
          <span className="font-medium text-ink">Subtotal</span>
          <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "identity", label: "Identity" },
    { key: "code", label: "Verify" },
    { key: "shipping", label: "Ship & pay" },
  ];
  const idx = steps.findIndex((s) => s.key === step);
  return (
    <ol className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={
              i <= idx
                ? "grid h-6 w-6 place-items-center rounded-full bg-green text-xs font-semibold text-white"
                : "grid h-6 w-6 place-items-center rounded-full border border-greenLine text-xs text-sub"
            }
          >
            {i + 1}
          </span>
          <span className={i <= idx ? "text-ink" : "text-sub"}>{s.label}</span>
          {i < steps.length - 1 && <span className="text-greenLine">—</span>}
        </li>
      ))}
    </ol>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none"
      />
    </label>
  );
}
