import { NextResponse } from "next/server";
import { getApprovedTestimonials } from "@/lib/testimonials";

// Public: approved testimonials for the footer slideshow. Evaluated per request
// so newly-approved reviews appear without a rebuild.
export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = await getApprovedTestimonials();
  return NextResponse.json({ testimonials });
}
