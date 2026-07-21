import Link from "next/link";
import Image from "next/image";
import { listPublishedPosts } from "@/lib/db";
import Reveal from "@/components/ui/Reveal";

export default function BlogPreview() {
  const posts = listPublishedPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="journal" className="relative overflow-hidden py-28 md:py-36">
      <div className="ambient-glow -right-40 top-1/4 h-[460px] w-[460px] bg-primary-container/10" />

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="label-caps">From the journal</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
              Notes on brand, websites and growth.
            </h2>
          </div>
          <Link
            href="/blog"
            className="shrink-0 font-body text-sm font-medium text-primary transition-colors hover:text-on-surface"
          >
            View all notes →
          </Link>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i}>
              <Link
                href={`/blog/${p.slug}`}
                className="group ghost-border flex h-full flex-col overflow-hidden rounded-xl bg-surface-low/40 transition-colors duration-500 hover:border-white/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-lowest">
                  {p.cover_image ? (
                    <Image
                      src={p.cover_image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-electric-gradient opacity-15" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="font-body text-xs text-outline">
                    {new Date(p.created_at + "Z").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="font-display text-xl font-semibold tracking-headline text-on-surface transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="line-clamp-3 flex-1 font-body text-sm leading-relaxed text-on-surface-variant">
                    {p.excerpt}
                  </p>
                  <span className="font-body text-sm font-medium text-primary">
                    Read the note →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
