import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/db";
import Footer from "@/components/scenes/Footer";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post || !post.published) return { title: "Not found — iDigital World" };
  return {
    title: `${post.title} — iDigital World`,
    description: post.excerpt,
  };
}

export default function BlogPost({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

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
          href="/blog"
          className="font-body text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          ← All notes
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <p className="font-body text-sm text-outline">
          {new Date(post.created_at + "Z").toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-headline text-on-surface md:text-5xl md:leading-[1.15]">
          {post.title}
        </h1>
        <p className="mt-6 font-body text-lg leading-relaxed text-on-surface-variant">
          {post.excerpt}
        </p>
        {post.cover_image && (
          <div className="ghost-border relative mt-10 aspect-[16/9] overflow-hidden rounded-xl bg-surface-lowest">
            <Image
              src={post.cover_image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="divider-h my-10" />
        {post.content.trim().startsWith("<") ? (
          // rich posts authored in the admin editor (trusted admin-only content)
          <div
            className="post-body font-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          // legacy plain-text posts: blank line = paragraph
          <div className="flex flex-col gap-6">
            {post.content
              .split(/\r?\n\s*\r?\n/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="font-body text-lg leading-relaxed text-on-surface">
                  {para}
                </p>
              ))}
          </div>
        )}

        <div className="glass mt-16 rounded-xl p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-on-surface">
            See it applied to your business.
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-base text-on-surface-variant">
            We&rsquo;ll design a free homepage mockup for you — no obligation.
          </p>
          <Link
            href="/#mockup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-electric-gradient px-7 py-3.5 font-body text-base font-medium text-white shadow-glow-primary"
          >
            Get a Free Mockup <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
