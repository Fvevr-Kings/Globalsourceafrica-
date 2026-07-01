import Link from "next/link";
import { listAdminPosts } from "@/lib/admin/data";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await listAdminPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">News & events</h1>
          <p className="text-sm text-sub">Posts appear on the public About timeline.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orangeDark"
        >
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-greenLine bg-white">
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sub">
            No posts yet. Add your first news or event.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-greenSoft text-left text-ink">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Photos</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-greenLine">
              {posts.map((p: any) => (
                <tr key={p.id} className="hover:bg-cream">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium text-ink hover:text-green">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-sub">{p.kind}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="text-green">Published</span>
                    ) : (
                      <span className="text-orangeDark">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sub">{p.image_urls?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/posts/${p.id}`} className="text-sm text-green hover:underline">
                        Edit
                      </Link>
                      <DeletePostButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
