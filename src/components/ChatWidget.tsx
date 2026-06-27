"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm the GlobalSource Africa assistant. I can help you find products, explain bulk pricing, or take a quote or sourcing request. What are you looking for?";

// Minimal renderer: turns [label](url) and bare /paths or https links into
// anchors, preserves line breaks. Avoids pulling in a markdown dependency.
function renderContent(text: string) {
  const parts: React.ReactNode[] = [];
  const pattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|(https?:\/\/[^\s]+|\/product\/[^\s]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const label = m[1];
    const href = m[2] ?? m[3];
    parts.push(
      <a
        key={key++}
        href={href}
        className="font-medium text-green underline underline-offset-2 hover:text-orange"
      >
        {label ?? href}
      </a>
    );
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ChatWidget() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only render once the server confirms the assistant is configured.
  useEffect(() => {
    let active = true;
    fetch("/api/chat")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => active && setEnabled(Boolean(d?.enabled)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setError(null);
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setError(e?.message ?? "The assistant is unavailable right now.");
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) return null;

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg transition hover:bg-orange focus:outline-none focus:ring-2 focus:ring-orange/50"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] max-h-[calc(100vh-7rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-greenLine bg-white shadow-2xl">
          <div className="flex items-center gap-2 bg-green px-4 py-3 text-white">
            <MessageCircle className="h-5 w-5" />
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">GlobalSource Assistant</p>
              <p className="text-xs text-white/80">Find products · quotes · sourcing</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-3 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-orange text-white"
                      : "border border-greenLine bg-white text-ink"
                  }`}
                >
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-greenLine bg-white px-3 py-2 text-sm text-sub">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                </div>
              </div>
            )}
            {error && (
              <p className="rounded-lg bg-orange/10 px-3 py-2 text-xs text-orangeDark">{error}</p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-greenLine bg-white p-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a product…"
              className="flex-1 rounded-full border border-greenLine px-4 py-2 text-sm text-ink focus:border-green focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-white hover:bg-orangeDark disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
