import { listBanners } from "@/lib/admin/data";
import { BannerManager } from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = (await listBanners()) as any[];
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Homepage billboard
      </h1>
      <p className="mt-1 text-sm text-sub">
        The hero banner is your billboard. Upload promotional GIFs or short
        videos and run them as ads.
      </p>
      <div className="mt-5">
        <BannerManager banners={banners} />
      </div>
    </div>
  );
}
