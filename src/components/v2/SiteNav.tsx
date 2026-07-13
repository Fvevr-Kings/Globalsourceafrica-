"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowLeft } from "lucide-react";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/origins", label: "Origins" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Admin / auth keep their own chrome.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) return null;

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-steel/15 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/main_logo.png" alt="GlobalSource Africa" className="h-9 w-auto" />
            <span className="flex items-baseline gap-2">
              <span className="gsa-heading text-lg font-extrabold uppercase tracking-tight text-navy">
                GlobalSource
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-container">
                Africa
              </span>
            </span>
          </Link>
          {/* Explicit back-to-home on every non-home page */}
          {!isHome && (
            <Link
              href="/"
              aria-label="Back to home"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 rounded-full border border-steel/25 px-3 py-1.5 text-xs font-semibold text-navy/70 transition-colors hover:border-container hover:text-container"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-container" : "text-navy/70 hover:text-navy"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/services/verification"
            className="text-sm font-medium text-navy/70 hover:text-navy"
          >
            Verify a Supplier
          </Link>
          <Link
            href="/request"
            className="rounded-full bg-container px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-container/90"
          >
            Request Sourcing
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-navy md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-steel/15 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy/80 hover:bg-paper"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/services/verification"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy/80 hover:bg-paper"
            >
              Verify a Supplier
            </Link>
            <Link
              href="/request"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-container px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Request Sourcing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
