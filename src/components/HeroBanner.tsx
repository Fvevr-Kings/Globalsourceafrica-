import { getActiveBanners } from "@/lib/banners";
import { HeroCarousel } from "./HeroCarousel";

/**
 * Homepage hero / billboard. Priority:
 *   1. Admin-managed banners (rotating billboard) from the `banners` table.
 *   2. NEXT_PUBLIC_BANNER_URL media (GIF / image / video) for a quick override.
 *   3. Built-in branded animated graphic so the page always looks designed.
 */
const BANNER_URL = process.env.NEXT_PUBLIC_BANNER_URL || "";
const HEIGHT = "h-36 w-full sm:h-44 lg:h-52";

function isVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export async function HeroBanner({
  title = "African farm products, sourced and verified.",
}: {
  title?: string;
}) {
  const banners = await getActiveBanners();

  // 1. Admin billboard.
  if (banners.length > 0) {
    return <HeroCarousel banners={banners} />;
  }

  // 2 & 3. Env media override, else the built-in animated graphic.
  return (
    <section className="relative isolate w-full overflow-hidden rounded-3xl border border-greenLine bg-green text-white">
      <div className={`relative ${HEIGHT}`}>
        {BANNER_URL ? (
          isVideo(BANNER_URL) ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={BANNER_URL}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={BANNER_URL}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
          )
        ) : (
          <DefaultGraphic />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-green/90 via-green/55 to-green/10" />

        <div className="relative flex h-full max-w-2xl flex-col justify-center px-6 sm:px-10">
          <h1 className="font-display text-xl font-semibold leading-tight tracking-tight drop-shadow sm:text-2xl lg:text-3xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

// Branded fallback: animated gradient + floating produce graphics. No network.
function DefaultGraphic() {
  return (
    <div className="absolute inset-0">
      <div className="gsa-sheen absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_20%,#2E8B5F_0%,#1F6B4A_45%,#164E36_100%)]" />
      <span className="gsa-drift absolute right-10 top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <span className="gsa-drift absolute right-40 bottom-0 h-24 w-24 rounded-full bg-orange/20 blur-2xl" style={{ animationDelay: "3s" }} />
      <span className="gsa-float absolute right-12 top-6 text-4xl sm:text-5xl" aria-hidden>🌾</span>
      <span className="gsa-float absolute right-28 bottom-6 text-3xl sm:text-4xl" aria-hidden style={{ animationDelay: "1.2s" }}>🫘</span>
      <span className="gsa-float absolute right-44 top-10 text-2xl sm:text-3xl" aria-hidden style={{ animationDelay: "2.4s" }}>☕</span>
      <span className="gsa-float absolute right-6 bottom-3 text-2xl sm:text-3xl" aria-hidden style={{ animationDelay: "0.6s" }}>🥜</span>
    </div>
  );
}
