import { NextResponse } from "next/server";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialById,
  setTestimonialPublished,
  updateTestimonial,
} from "@/lib/db";
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

  const id = Number(body.id ?? 0);

  // lightweight publish/unpublish toggle from the table view
  if (id > 0 && body.client_name === undefined && typeof body.published === "boolean") {
    if (!getTestimonialById(id)) {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }
    setTestimonialPublished(id, body.published);
    return NextResponse.json({ ok: true });
  }

  const client_name = String(body.client_name ?? "").trim().slice(0, 120);
  const client_role = String(body.client_role ?? "").trim().slice(0, 120);
  const quote = String(body.quote ?? "").trim().slice(0, 1000);
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));
  const published = Boolean(body.published);

  if (!client_name || !quote || !rating) {
    return NextResponse.json(
      { error: "Name, rating and review text are required." },
      { status: 400 }
    );
  }

  if (id > 0) {
    if (!getTestimonialById(id)) {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }
    updateTestimonial(id, { client_name, client_role, rating, quote, published });
    return NextResponse.json({ ok: true, id });
  }

  const newId = createTestimonial({ client_name, client_role, rating, quote, published });
  return NextResponse.json({ ok: true, id: newId });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return unauthorized();
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id || !getTestimonialById(id)) {
    return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
  }
  deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
