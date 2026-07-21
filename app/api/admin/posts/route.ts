import { NextResponse } from "next/server";
import { createPost, deletePost, getPostById, updatePost } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Not authorised." }, { status: 401 });
}

export async function POST(req: Request) {
  if (!isAdmin()) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim().slice(0, 200);
  const excerpt = String(body.excerpt ?? "").trim().slice(0, 500);
  const content = String(body.content ?? "").trim().slice(0, 50000);
  const cover_image = String(body.cover_image ?? "").trim().slice(0, 300);
  const published = Boolean(body.published);

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  const id = Number(body.id ?? 0);
  if (id > 0) {
    if (!getPostById(id)) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    updatePost(id, { title, excerpt, content, cover_image, published });
    return NextResponse.json({ ok: true, id });
  }

  const newId = createPost({ title, excerpt, content, cover_image, published });
  return NextResponse.json({ ok: true, id: newId });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return unauthorized();
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id || !getPostById(id)) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  deletePost(id);
  return NextResponse.json({ ok: true });
}
