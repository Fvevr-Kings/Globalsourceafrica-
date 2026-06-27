import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// The admin-maintained knowledge base text, appended to the assistant's system
// prompt. Resilient: returns "" if the table doesn't exist yet (migration 0007
// not applied) so the chatbot never 500s.
export async function getKnowledgeText(): Promise<string> {
  try {
    const db = createSupabaseAdminClient();
    const { data, error } = await db
      .from("chatbot_knowledge")
      .select("content")
      .eq("id", true)
      .maybeSingle();
    if (error) return "";
    return (data?.content ?? "").trim();
  } catch {
    return "";
  }
}
