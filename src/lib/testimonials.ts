import { createSupabaseServerClient } from "./supabase/server";
import { isDemoMode } from "./products";
import type { Testimonial } from "./types";

// Approved testimonials for the storefront slideshow, in display order. Returns
// [] in demo mode or if the testimonials table isn't there yet (graceful — the
// footer simply hides the slideshow), matching the banners pattern.
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  if (isDemoMode()) return [];
  try {
    const db = createSupabaseServerClient();
    // select("*") so this stays resilient whether or not the optional
    // avatar_url column (migration 0011) has been applied yet.
    const { data, error } = await db
      .from("testimonials")
      .select("*")
      .eq("approval_status", "approved")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Testimonial[];
  } catch {
    return [];
  }
}
