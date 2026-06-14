import { CartView } from "@/components/CartView";

// Client-rendered: the cart lives entirely client-side until an order is placed.
export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Your cart
      </h1>
      <CartView />
    </div>
  );
}
