import { createSupabaseServerClient } from "./supabase/server";

export type Post = {
  id: string;
  title: string;
  body: string | null;
  image_urls: string[];
  kind: "news" | "event" | string;
  event_date: string | null;
  created_at: string;
};

// Published news/events for the public About timeline. Resilient: returns [] if
// the table doesn't exist yet (migration 0009 not applied) so /about never 500s.
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const db = createSupabaseServerClient();
    const { data, error } = await db
      .from("posts")
      .select("id, title, body, image_urls, kind, event_date, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}
