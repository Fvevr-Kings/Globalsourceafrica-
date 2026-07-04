import { listTestimonials } from "@/lib/admin/data";
import { TestimonialManager } from "@/components/admin/TestimonialManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = (await listTestimonials()) as any[];
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Testimonials
      </h1>
      <p className="mt-1 text-sm text-sub">
        Customer reviews shown in the site slideshow. Approve submissions to make
        them public, or add your own. Pending and rejected reviews stay hidden.
      </p>
      <div className="mt-5">
        <TestimonialManager testimonials={testimonials} />
      </div>
    </div>
  );
}
