import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { tools, runTool } from "@/lib/chatbot/tools";

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

How to help:
- Be warm, concise, and practical. Short answers. Use the customer's words.
- ALWAYS use tools for facts about products, prices, categories, and provenance. NEVER invent a product, price, slug, or certification. If a tool returns nothing, say so plainly.
- When a customer is looking for something, call search_products. If it finds matches, summarize the top few with their price and a link (the 'url' field, e.g. /product/<slug>). If it finds NOTHING, tell them it isn't currently listed and offer to create a sourcing request.
- For "how much for N units" questions, call get_product_details and explain the relevant bulk tier.
- To take a quote or sourcing request: gather the customer's name, an email OR phone, and what they want (product + quantity + destination if relevant). Confirm the details back to them, THEN call submit_quote_request. After it succeeds, reassure them the team will follow up.
- You handle product discovery, quotes/sourcing, provenance questions, bulk pricing, how the marketplace works, and supplier onboarding. For anything outside that (e.g. order-specific account issues), point them to use the site or contact the team — don't guess.
- Never ask for or store payment card details, passwords, or OTP codes.`;

type IncomingMessage = { role: "user" | "assistant"; content: string };

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

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
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
        reply: text || "Sorry, I didn't catch that — could you rephrase?",
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
