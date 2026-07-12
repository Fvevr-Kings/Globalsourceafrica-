import Link from "next/link";
import { MonoLabel } from "../MonoLabel";
import { SceneImg } from "./SceneImg";

// Closing CTA band. The animated crane/flatbed set piece was replaced by a
// single still image (drop it at /public/scenes/landing.webp) per request —
// simpler and photoreal. Just copy + a static hero image, no scroll animation.
export function LandingCTA() {
  return (
    <section className="gsa-corrugation overflow-hidden bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 pb-8 pt-20 text-center sm:pt-24">
        <MonoLabel className="text-container">THE DEAL, DELIVERED</MonoLabel>
        <h2 className="gsa-heading mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          Ready to source from Africa without the risk?
        </h2>

        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/services/verification"
              className="rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90"
            >
              Verify a Supplier — from $400
            </Link>
            <Link
              href="/request"
              className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/5"
            >
              Talk to a Sourcing Specialist
            </Link>
          </div>
          <MonoLabel as="p" className="mt-5 text-center text-white/50">
            RESPONSE WITHIN 48 HOURS · ACCRA, GHANA (GMT)
          </MonoLabel>
        </div>

        {/* Static closing image */}
        <div className="mx-auto mt-12 w-full max-w-4xl">
          <SceneImg
            src="/scenes/landing.webp"
            alt="GlobalSource Africa — container delivered onto the truck"
            className="mx-auto h-auto w-full"
            label="DROP: /public/scenes/landing.(png/webp) — closing still image"
          />
        </div>
      </div>
    </section>
  );
}
