import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMerchant } from "@/lib/merchant/auth";
import { MerchantNav } from "@/components/merchant/MerchantNav";

export const dynamic = "force-dynamic";

export default async function MerchantPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const merchant = await getMerchant();
  if (!merchant) {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // Logged in but not a verified supplier → show the "not approved" notice.
    redirect(user ? "/merchant/login?denied=1" : "/merchant/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <MerchantNav businessName={merchant.businessName} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
