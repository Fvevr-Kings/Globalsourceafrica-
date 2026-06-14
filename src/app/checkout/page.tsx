import { CheckoutForm } from "@/components/CheckoutForm";

// Passwordless checkout — identity is captured only here, via OTP/magic link.
export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
