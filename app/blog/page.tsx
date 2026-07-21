import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listPublishedPosts } from "@/lib/db";
import Footer from "@/components/scenes/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — iDigital World",
  description:
    "Notes on brand, websites and growth from a founder-led digital studio in the UK.",
};

export default function BlogIndex() {
  const posts = listPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-container items-center justify-between px-5 pt-8 md:px-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/logo-primary-light.svg"
            alt="iDigital World"
            width={150}
            height={36}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>
        <Link
          href="/#mockup"
          className="font-body text-sm font-medium text-primary transition-colors hover:text-on-surface"
        >
          Get a Free Mockup →
        </Link>
      </header>

      <section className="relative overflow-hidden px-5 py-20 md:px-16 md:py-28">
        <div className="ambient-glow -left-40 top-0 h-[420px] w-[420px] bg-secondary-container/15" />
        <div className="relative mx-auto max-w-container">
          <span className="label-caps">Journal</span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-headline text-on-surface md:text-6xl">
            Notes on brand, websites and growth.
          </h1>

          {posts.length === 0 && (
            <p className="mt-16 font-body text-lg text-on-surface-variant">
              Nothing published yet — check back soon.
            </p>
          )}

          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group ghost-border relative mt-16 grid grid-cols-1 overflow-hidden rounded-2xl bg-surface-low/40 transition-colors duration-500 hover:border-white/20 md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-lowest md:aspect-auto">
                {featured.cover_image ? (
                  <Image
                    src={featured.cover_image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-electric-gradient opacity-20" />
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
                <span className="label-caps">Latest</span>
                <p className="font-body text-sm text-outline">
                  {new Date(featured.created_at + "Z").toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-headline text-on-surface transition-colors group-hover:text-primary md:text-4xl">
                  {featured.title}
                </h2>
                <p className="max-w-lg font-body text-base leading-relaxed text-on-surface-variant">
                  {featured.excerpt}
                </p>
                <span className="font-body text-sm font-medium text-primary">
                  Read the note →
                </span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group ghost-border flex flex-col overflow-hidden rounded-xl bg-surface-low/40 transition-colors duration-500 hover:border-white/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-lowest">
                    {p.cover_image ? (
                      <Image
                        src={p.cover_image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    <h2 className="font-display text-xl font-semibold tracking-headline text-on-surface transition-colors group-hover:text-primary">
                      {p.title}
                    </h2>
                    <p className="line-clamp-3 flex-1 font-body text-sm leading-relaxed text-on-surface-variant">
                      {p.excerpt}
                    </p>
                    <span className="font-body text-sm font-medium text-primary">
                      Read the note →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
