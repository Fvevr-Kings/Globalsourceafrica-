"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sub"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search grains, nuts, spices… try “groundnut” or “zobo”"
        aria-label="Search products"
        className="w-full rounded-full border border-greenLine bg-white py-4 pl-12 pr-12 text-base text-ink placeholder:text-sub focus:border-green focus:outline-none"
      />
      {loading && (
        <span
          className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-greenLine border-t-green"
          aria-label="Searching"
        />
      )}
    </div>
  );
}
