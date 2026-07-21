import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listAllPosts } from "@/lib/db";
import AdminShell from "../AdminShell";
import PostManager from "./PostManager";

export const dynamic = "force-dynamic";

export default function AdminPosts() {
  if (!isAdmin()) redirect("/admin/login");

  const posts = listAllPosts();

  return (
    <AdminShell active="posts">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-bold tracking-headline text-on-surface">
          Journal posts
        </h1>
        <span className="font-body text-sm text-on-surface-variant">
          {posts.length} total
        </span>
      </div>
      <PostManager posts={posts} />
    </AdminShell>
  );
}
