import type { Metadata } from "next";
import { Newspaper, CalendarDays } from "lucide-react";
import { getPublishedPosts, type Post } from "@/lib/posts";
import { CeoPhoto } from "@/components/CeoPhoto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About us — GlobalSource Africa",
  description:
    "Our mission, our story, and the people behind GlobalSource Africa — connecting Africa's resources to the global market.",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function AboutPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Mission / brand voice */}
      <section className="text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-orange">
          Who we are
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Connecting Africa&apos;s resources to the global market
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-sub">
          GlobalSource Africa exists to bring the continent&apos;s finest farm
          produce and raw materials to buyers around the world — transparently,
          reliably, and at fair value. We stand behind every order as the
          merchant of record, so you always buy from a business you can trust,
          never a stranger.
        </p>
      </section>

      {/* Mission + history cards */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-greenLine bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-green">Our mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-sub">
            To open real, direct access between Africa&apos;s producers and the
            world — championing verified quality, honest provenance, and lasting
            relationships that lift the farmers and cooperatives behind every
            harvest.
          </p>
        </div>
        <div className="rounded-2xl border border-greenLine bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-green">Our story</h2>
          <p className="mt-2 text-sm leading-relaxed text-sub">
            We started with a simple frustration: Africa is rich in grains,
            nuts, cocoa, coffee, shea and raw materials the world wants — yet
            buyers struggled to source them with confidence. GlobalSource Africa
            closes that gap, pairing rigorous quality checks with the trust of a
            single business standing behind every shipment.
          </p>
        </div>
      </section>

      {/* CEO */}
      <section className="mt-6 flex flex-col items-center gap-6 rounded-2xl border border-greenLine bg-cream p-6 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <CeoPhoto />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">A note from our CEO</h2>
          <p className="mt-2 text-sm italic leading-relaxed text-sub">
            &ldquo;Every bag we ship carries the name and effort of an African
            producer. Our promise is simple — quality you can verify, and a
            partner you can count on, order after order.&rdquo;
          </p>
          <p className="mt-3 text-sm font-semibold text-ink">The GlobalSource Africa Team</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold text-ink">News &amp; events</h2>
        <p className="mt-1 text-sm text-sub">
          A look at our recent dealings, deliveries, and milestones.
        </p>

        {posts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-greenLine bg-white p-10 text-center text-sub">
            No updates yet — check back soon.
          </div>
        ) : (
          <ol className="mt-6 space-y-6">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const dateLabel = formatDate(post.event_date) || formatDate(post.created_at);
  const isEvent = post.kind === "event";
  return (
    <li className="overflow-hidden rounded-2xl border border-greenLine bg-white">
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-orange">
          {isEvent ? <CalendarDays className="h-4 w-4" /> : <Newspaper className="h-4 w-4" />}
          {isEvent ? "Event" : "News"}
          {dateLabel && <span className="text-sub">· {dateLabel}</span>}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-ink">{post.title}</h3>
        {post.body && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-sub">{post.body}</p>
        )}
      </div>

      {post.image_urls?.length > 0 && (
        <div
          className={`grid gap-1 ${
            post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.image_urls.slice(0, 4).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={post.title}
              className="h-56 w-full object-cover"
            />
          ))}
        </div>
      )}
    </li>
  );
}
