import { getKnowledgeText } from "@/lib/chatbot/knowledge";
import { KnowledgeForm } from "@/components/admin/KnowledgeForm";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const content = await getKnowledgeText();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Assistant knowledge
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-sub">
          Anything you write here is given to the AI shopping assistant on every
          chat, so it can answer customers accurately about your business —
          shipping, payment, lead times, sourcing details, policies, FAQs, and
          more. The assistant already knows your live products and prices; use
          this to teach it everything else. Update it anytime.
        </p>
      </div>

      <KnowledgeForm initial={content} />
    </div>
  );
}
