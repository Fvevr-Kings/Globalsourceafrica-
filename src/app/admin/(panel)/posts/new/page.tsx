import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> News & events
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">New post</h1>
      <div className="mt-5">
        <PostForm />
      </div>
    </div>
  );
}
