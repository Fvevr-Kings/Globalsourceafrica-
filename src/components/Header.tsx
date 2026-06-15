"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { HeaderMenu } from "./HeaderMenu";

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();

  // The admin and merchant areas have their own chrome — hide the storefront
  // header there.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/merchant")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-greenLine bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Top-left menu: quote, supplier portal, admin. */}
        <HeaderMenu />

        <Link
          href="/"
          className="text-center font-display text-xl font-bold tracking-tight text-green sm:text-2xl"
        >
          Global-Source Africa
        </Link>

        <Link
          href="/cart"
          className="relative flex w-10 justify-end text-ink hover:text-green"
          aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
        >
          <ShoppingCart className="h-6 w-6" />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
