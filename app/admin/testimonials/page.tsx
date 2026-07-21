import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listAllTestimonials, listReviewLinks } from "@/lib/db";
import AdminShell from "../AdminShell";
import TestimonialManager from "./TestimonialManager";

export const dynamic = "force-dynamic";

export default function AdminTestimonials() {
  if (!isAdmin()) redirect("/admin/login");

  return (
    <AdminShell active="testimonials">
      <h1 className="font-display text-3xl font-bold tracking-headline text-on-surface">
        Testimonials
      </h1>
      <p className="mt-2 max-w-2xl font-body text-sm text-on-surface-variant">
        Add a review you&rsquo;ve collected yourself, or generate a one-time
        link and send it to a client — they fill in the form once, and it
        lands here for you to approve before it appears on the site.
      </p>
      <TestimonialManager testimonials={listAllTestimonials()} links={listReviewLinks()} />
    </AdminShell>
  );
}
