import { createSupabaseServerClient } from "./supabase/server";
import { isDemoMode } from "./products";

export type Banner = {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  headline: string | null;
  subtitle: string | null;
  link_url: string | null;
  cta_label: string | null;
  sort: number;
  active: boolean;
};

// Active billboard banners for the homepage hero, in display order. Returns []
// in demo mode or if the banners table isn't there yet (graceful — the hero
// then falls back to the env media / built-in animated graphic).
export async function getActiveBanners(): Promise<Banner[]> {
  if (isDemoMode()) return [];
  try {
    const db = createSupabaseServerClient();
    const { data, error } = await db
      .from("banners")
      .select("id, media_url, media_type, headline, subtitle, link_url, cta_label, sort, active")
      .eq("active", true)
      .order("sort", { ascending: true });
    if (error) return [];
    return (data ?? []) as Banner[];
  } catch {
    return [];
  }
}
