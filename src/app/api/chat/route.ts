import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { tools, runTool } from "@/lib/chatbot/tools";
import { getKnowledgeText } from "@/lib/chatbot/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fast + low-cost model for a customer-support assistant.
const CHAT_MODEL = "claude-haiku-4-5";
const MAX_TOOL_ROUNDS = 6;
const MAX_HISTORY = 24; // keep payloads bounded

const SYSTEM_PROMPT = `You are the shopping assistant for GlobalSource Africa, an online marketplace for non-perishable African farm products (grains, pulses, nuts, dried spices, cocoa, coffee, shea, and more) sourced from verified African origins.

About the business, so you can answer accurately:
- GlobalSource Africa is the merchant of record: customers buy from the business, which stands behind every order. Suppliers are kept behind the brand — never reveal or speculate about which supplier provides a product.
- Prices are in USD. Many products have bulk price tiers (lower per-unit price at higher quantities).
- Products show structured provenance: origin country/region, harvest date, grade, moisture, certifications, and quality reports.
- Buyers can request a formal quote, and can ask the team to SOURCE a product that isn't listed yet.
- Businesses can apply to supply via the "Become a supplier" page (/become-a-supplier).

How you talk (important):
- Write like a friendly human texting a friend — warm, natural, easy. Short.
- PLAIN TEXT ONLY. Never use Markdown or special formatting: no asterisks for bold (**), no underscores, no # headings, no backticks, no tables. They render as literal characters and look broken.
- Just talk normally. Put prices and details inline, e.g. "It's $65 for a 10kg bag, straight from Ghana."
- Use a simple list (lines starting with "- ") ONLY when you're listing several separate items, like multiple products. For a single product, don't use a list — just say it in a sentence or two.
- Keep replies to a few lines unless the customer asks for more detail.

How to help:
- ALWAYS use tools for facts about products, prices, categories, and provenance. NEVER invent a product, price, slug, or certification. If a tool returns nothing, say so plainly.
- When a customer is looking for something, call search_products. Matching products are shown to the customer automatically as tappable cards right below your message, so DON'T paste raw URLs or slugs in your text — just describe them naturally (e.g. "Yes! Here's our cocoa 👇") and let the cards do the rest. If search finds NOTHING, tell them it isn't currently listed and offer to create a sourcing request.
- For "how much for N units" questions, call get_product_details and explain the relevant bulk tier.
- To take a quote or sourcing request: gather the customer's name, an email OR phone, and what they want (product + quantity + destination if relevant). Confirm the details back to them, THEN call submit_quote_request. After it succeeds, reassure them the team will follow up.
- You handle product discovery, quotes/sourcing, provenance questions, bulk pricing, how the marketplace works, and supplier onboarding. For anything outside that (e.g. order-specific account issues), point them to use the site or contact the team — don't guess.
- Never ask for or store payment card details, passwords, or OTP codes.`;

type IncomingMessage = { role: "user" | "assistant"; content: string };

type ProductCard = {
  name: string;
  slug: string;
  price_usd: number | null;
  base_unit: string | null;
  origin_country: string | null;
  in_stock: boolean;
  image: string | null;
  url: string;
};

// Normalize a search_products / get_product_details result into a card.
function toCard(p: any): ProductCard {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    price_usd: p?.price_usd ?? p?.retail_price_usd ?? null,
    base_unit: p?.base_unit ?? null,
    origin_country: p?.origin_country ?? null,
    in_stock: p?.in_stock ?? true,
    image: p?.image ?? null,
    url: p?.url ?? (p?.slug ? `/product/${p.slug}` : "/"),
  };
}

// Safety net: strip Markdown emphasis/heading/code markers so replies read as
// plain, friendly text even if the model slips into Markdown.
function plainText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/__(.*?)__/g, "$1") // __bold__
    .replace(/(^|\s)\*(?=\S)(.+?)\*(?=\s|$)/g, "$1$2") // *italic*
    .replace(/`+/g, "") // `code`
    .replace(/^#{1,6}\s+/gm, "") // # headings
    .replace(/^\s*[*+]\s+/gm, "- ") // normalize *,+ bullets to -
    .trim();
}

// Runtime health check — the widget calls this to decide whether to render.
// Evaluated at request time, so it reflects the live env without a rebuild.
export async function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured." },
      { status: 503 }
    );
  }

  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const history = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY);

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected a user message." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  // Append the admin-maintained knowledge base to the system prompt.
  const knowledge = await getKnowledgeText();
  const system = knowledge
    ? `${SYSTEM_PROMPT}\n\nADDITIONAL BUSINESS KNOWLEDGE (maintained by the team — treat as authoritative and use it whenever relevant):\n${knowledge}`
    : SYSTEM_PROMPT;

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Product cards to show under the reply — taken from the most recent product
  // tool call this turn (what the assistant is actually answering about).
  let cards: ProductCard[] = [];

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system,
        tools,
        messages,
      });

      if (response.stop_reason === "tool_use") {
        const toolUses = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
        );
        messages.push({ role: "assistant", content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const tu of toolUses) {
          const result = await runTool(tu.name, tu.input);
          // Capture product cards from the latest product-bearing tool call.
          if (result.ok && tu.name === "search_products") {
            cards = (result.data as any[]).map(toCard);
          } else if (result.ok && tu.name === "get_product_details") {
            cards = [toCard(result.data)];
          }
          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: JSON.stringify(result.ok ? result.data : { error: result.error }),
            is_error: !result.ok,
          });
        }
        messages.push({ role: "user", content: toolResults });
        continue;
      }

      // Final answer.
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      return NextResponse.json({
        reply: plainText(text) || "Sorry, I didn't catch that — could you rephrase?",
        products: cards.slice(0, 4),
      });
    }

    return NextResponse.json({
      reply: "That took longer than expected — could you rephrase or narrow it down?",
    });
  } catch (e: any) {
    console.error("[chat] error:", e?.message ?? e);
    return NextResponse.json(
      { error: "The assistant is unavailable right now. Please try again." },
      { status: 502 }
    );
  }
}
