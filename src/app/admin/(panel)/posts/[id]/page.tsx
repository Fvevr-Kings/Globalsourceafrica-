import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAdminPost } from "@/lib/admin/data";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getAdminPost(params.id);
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> News & events
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Edit: {post.title}</h1>
      <div className="mt-5">
        <PostForm initial={post} />
      </div>
    </div>
  );
}
