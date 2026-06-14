"use client";

import { useRef } from "react";

// 6-digit code entry. Passwordless — this is the only credential a buyer enters.
export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.padEnd(length, " ").slice(0, length).split("");

  function setChar(i: number, c: string) {
    const digit = c.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[i] = digit;
    const joined = next.join("").replace(/\s/g, "").slice(0, length);
    onChange(joined);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
      e.preventDefault();
    }
  }

  return (
    <div className="flex gap-2" onPaste={onPaste}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={c.trim()}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className="h-12 w-12 rounded-lg border border-greenLine bg-white text-center text-lg font-semibold text-ink focus:border-green focus:outline-none"
        />
      ))}
    </div>
  );
}
