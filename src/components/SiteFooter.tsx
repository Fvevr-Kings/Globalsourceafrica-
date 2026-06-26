"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/merchant")) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-greenLine bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-sub sm:flex-row sm:items-center sm:justify-between">
        <p>
          Sold and backed by GlobalSource Africa. Every order is fulfilled by
          us — you pay the business, never a stranger.
        </p>
        <span className="flex flex-wrap gap-4">
          <a href="/request-quote" className="font-medium text-green hover:underline">
            Request a quote
          </a>
          <a href="/become-a-supplier" className="font-medium text-green hover:underline">
            Become a supplier →
          </a>
          <a href="/merchant" className="font-medium text-green hover:underline">
            Supplier login
          </a>
        </span>
      </div>
    </footer>
  );
}
