import { MerchantLoginForm } from "@/components/merchant/MerchantLoginForm";

export const dynamic = "force-dynamic";

export default function MerchantLoginPage({
  searchParams,
}: {
  searchParams: { denied?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-semibold text-green">
            Global-Source Africa
          </span>
          <p className="text-sm text-sub">Supplier portal</p>
        </div>
        <MerchantLoginForm denied={searchParams.denied === "1"} />
        <p className="mt-4 text-center text-sm text-sub">
          Not a supplier yet?{" "}
          <a href="/become-a-supplier" className="font-medium text-green hover:underline">
            Apply here
          </a>
        </p>
      </div>
    </div>
  );
}
