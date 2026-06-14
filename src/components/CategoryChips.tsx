"use client";

export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}) {
  const all = ["All", ...categories];
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {all.map((cat) => {
        const selected = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            aria-pressed={selected}
            className={
              selected
                ? "rounded-full bg-green px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-greenLine bg-white px-4 py-2 text-sm font-medium text-ink hover:border-green"
            }
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
