import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { denied?: string; error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-semibold text-green">
            GlobalSource Africa
          </span>
          <p className="text-sm text-sub">Admin console</p>
        </div>
        {searchParams.error === "link" && (
          <p className="mb-4 rounded-lg bg-orange/10 px-3 py-2 text-sm text-orangeDark">
            That sign-in link expired or was already used. Request a new one
            below.
          </p>
        )}
        <AdminLoginForm denied={searchParams.denied === "1"} />
      </div>
    </div>
  );
}
