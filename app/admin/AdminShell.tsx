import Image from "next/image";
import Link from "next/link";

export default function AdminShell({
  active,
  children,
}: {
  active: "contacts" | "posts" | "testimonials";
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-5 pb-20 md:px-16">
      <header className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src="/brand/logo-primary-light.svg"
              alt="iDigital World"
              width={140}
              height={34}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-6" aria-label="Admin">
            <Link
              href="/admin"
              className={`font-body text-sm ${active === "contacts" ? "font-medium text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Mockup requests
            </Link>
            <Link
              href="/admin/posts"
              className={`font-body text-sm ${active === "posts" ? "font-medium text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Journal posts
            </Link>
            <Link
              href="/admin/testimonials"
              className={`font-body text-sm ${active === "testimonials" ? "font-medium text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Testimonials
            </Link>
          </nav>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="glass rounded-lg px-4 py-2 font-body text-sm text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Sign out
          </button>
        </form>
      </header>
      <div className="mx-auto max-w-container">{children}</div>
    </main>
  );
}
