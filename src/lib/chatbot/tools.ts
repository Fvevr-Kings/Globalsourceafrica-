import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import {
  searchProducts,
  getProductBySlug,
  getCategories,
} from "@/lib/products";
import { submitQuoteRequest } from "@/lib/quotes";

// Tool surface the marketplace assistant can call. Each tool is executed
// server-side against Supabase via the existing data layer, so the assistant
// can only ever see buyer-safe data (public_products view) and can only write
// quote requests through the same validated server action the site uses.

export const tools: Anthropic.Tool[] = [
  {
    name: "search_products",
    description:
      "Search the catalog for products by keyword (name, category, origin, use). " +
      "Use this whenever the customer is looking for something. If it returns an " +
      "empty list, tell the customer it's not currently listed and offer to create " +
      "a sourcing request via submit_quote_request (request_type='sourcing').",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "What the customer is looking for, e.g. 'cashew nuts', 'coffee', 'shea butter'.",
        },
        max_results: {
          type: "integer",
          description: "Max results to return (default 6).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_product_details",
    description:
      "Get full details for one product by its slug (from search_products results): " +
      "price, provenance (origin region, harvest date, grade, certifications), and bulk price tiers.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "The product slug, e.g. 'green-arabica-coffee-1kg'." },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_categories",
    description: "List the product categories currently available on the marketplace.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "submit_quote_request",
    description:
      "Submit a quote request for a listed product, or a sourcing request for a " +
      "product not yet listed. Only call this once you have collected the customer's " +
      "name, a contact (email OR phone), and what they want. Confirm the details with " +
      "the customer before submitting.",
    input_schema: {
      type: "object",
      properties: {
        request_type: {
          type: "string",
          enum: ["quote", "sourcing"],
          description: "'quote' for a listed product, 'sourcing' for something not listed.",
        },
        contact_name: { type: "string", description: "Customer's name." },
        contact_email: { type: "string", description: "Customer's email (email or phone required)." },
        contact_phone: { type: "string", description: "Customer's phone (email or phone required)." },
        company: { type: "string", description: "Company name (optional)." },
        country: { type: "string", description: "Customer's country (optional)." },
        product_slug: {
          type: "string",
          description: "Slug of the listed product this is about, if any (links the request to the product).",
        },
        product_name: { type: "string", description: "Name / description of the product they want." },
        quantity: { type: "string", description: "Desired quantity, free text e.g. '20 tonnes', '100 x 5kg'." },
        target_price_usd: { type: "number", description: "Target price per unit in USD (optional)." },
        destination: { type: "string", description: "Shipping destination (optional)." },
        message: { type: "string", description: "Any extra detail from the customer (optional)." },
      },
      required: ["request_type", "contact_name", "product_name"],
    },
  },
];

type ToolResult = { ok: true; data: unknown } | { ok: false; error: string };

export async function runTool(name: string, input: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "search_products": {
        const max = Math.min(Math.max(Number(input?.max_results) || 6, 1), 12);
        const results = await searchProducts(String(input?.query ?? ""));
        return {
          ok: true,
          data: results.slice(0, max).map((p) => ({
            name: p.name,
            slug: p.slug,
            category: p.category,
            origin_country: p.origin_country,
            base_unit: p.base_unit,
            price_usd: p.retail_price_usd,
            in_stock: p.in_stock,
            blurb: p.blurb,
            image: p.image_urls?.[0] ?? null,
            url: `/product/${p.slug}`,
          })),
        };
      }

      case "get_product_details": {
        const product = await getProductBySlug(String(input?.slug ?? ""));
        if (!product) return { ok: false, error: "No product found with that slug." };
        return {
          ok: true,
          data: {
            name: product.name,
            slug: product.slug,
            category: product.category,
            origin_country: product.origin_country,
            origin_region: product.origin_region,
            base_unit: product.base_unit,
            retail_price_usd: product.retail_price_usd,
            in_stock: product.in_stock,
            description: product.description,
            grade: product.grade,
            harvest_date: product.harvest_date,
            moisture_pct: product.moisture_pct,
            certifications: product.certifications,
            quality_report_url: product.quality_report_url,
            price_usd: product.retail_price_usd,
            image: product.image_urls?.[0] ?? null,
            bulk_tiers: (product.tiers ?? []).map((t) => ({
              min_qty: t.min_qty,
              unit_price_usd: t.unit_price_usd,
            })),
            url: `/product/${product.slug}`,
          },
        };
      }

      case "list_categories": {
        const categories = await getCategories();
        return { ok: true, data: { categories } };
      }

      case "submit_quote_request": {
        // Resolve product_id from slug when the request is about a listed product.
        let product_id: string | null = null;
        if (input?.product_slug) {
          const product = await getProductBySlug(String(input.product_slug));
          product_id = product?.id ?? null;
        }
        const result = await submitQuoteRequest({
          request_type: input?.request_type === "sourcing" ? "sourcing" : "quote",
          contact_name: String(input?.contact_name ?? "").trim(),
          contact_email: input?.contact_email ? String(input.contact_email) : null,
          contact_phone: input?.contact_phone ? String(input.contact_phone) : null,
          company: input?.company ? String(input.company) : null,
          country: input?.country ? String(input.country) : null,
          product_id,
          product_name: input?.product_name ? String(input.product_name) : null,
          quantity: input?.quantity ? String(input.quantity) : null,
          target_price_usd:
            input?.target_price_usd != null ? Number(input.target_price_usd) : null,
          destination: input?.destination ? String(input.destination) : null,
          message: input?.message ? String(input.message) : null,
        });
        if (!result.ok) return { ok: false, error: result.error };
        return {
          ok: true,
          data: { submitted: true, reference: result.id, note: "Our team will follow up." },
        };
      }

      default:
        return { ok: false, error: `Unknown tool: ${name}` };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Tool execution failed." };
  }
}
