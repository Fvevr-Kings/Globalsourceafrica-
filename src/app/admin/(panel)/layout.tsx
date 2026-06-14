import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStaff } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

// Gate for the whole authenticated admin area. Login lives outside this group.
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await getStaff();
  if (!staff) {
    // Distinguish "not logged in" from "logged in but not on the allowlist".
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    redirect(user ? "/admin/login?denied=1" : "/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <AdminNav staffName={staff.name ?? staff.contact} role={staff.role} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
