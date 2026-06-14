"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, LogOut, ExternalLink } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [
  { href: "/merchant", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/merchant/products", label: "My products", icon: Package },
];

export function MerchantNav({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/merchant/login");
    router.refresh();
  }

  return (
    <aside className="w-full shrink-0 lg:w-60">
      <div className="rounded-2xl border border-greenLine bg-white p-4">
        <span className="font-display text-lg font-semibold text-green">
          Supplier portal
        </span>
        <p className="truncate text-xs text-sub">{businessName}</p>

        <nav className="mt-4 space-y-1">
          {links.map((l) => {
            const active = l.exact
              ? pathname === l.href
              : pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "flex items-center gap-2 rounded-lg bg-greenSoft px-3 py-2 text-sm font-medium text-green"
                    : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-greenSoft"
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-greenLine pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sub hover:bg-greenSoft"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View storefront
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sub hover:bg-greenSoft"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
