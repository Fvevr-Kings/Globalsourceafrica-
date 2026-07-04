"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, FileText, Store, LogIn, Home, Boxes, Info, Truck } from "lucide-react";

// Public storefront menu. Intentionally NO "Admin" link — staff go to /admin
// directly; advertising it to every customer is poor practice (the route is
// still gated server-side regardless).
const links = [
  { href: "/", label: "Shop farm products", icon: Home },
  { href: "/raw-materials", label: "Shop African raw materials", icon: Boxes },
  { href: "/about", label: "About us", icon: Info },
  { href: "/track", label: "Track your order", icon: Truck },
  { href: "/request-quote", label: "Request a quote", icon: FileText },
  { href: "/become-a-supplier", label: "Become a supplier", icon: Store },
  { href: "/merchant", label: "Supplier login", icon: LogIn },
];

// Top-left navigation menu. Houses non-storefront entry points (quote, supplier
// portal, admin) so they're reachable without cluttering the header.
export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-greenSoft"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <nav className="absolute left-0 top-12 z-40 w-60 overflow-hidden rounded-2xl border border-greenLine bg-white py-2 shadow-lg">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-greenSoft"
              >
                <Icon className="h-4 w-4 text-green" aria-hidden />
                {l.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
