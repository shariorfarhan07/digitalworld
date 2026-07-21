import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-24 md:px-16">
      <div className="mx-auto max-w-container">
        <div className="divider-h mb-12" />
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="flex flex-col gap-4">
            <Image
              src="/brand/logo-primary-light.svg"
              alt="iDigital World"
              width={160}
              height={38}
              className="h-9 w-auto"
            />
            <p className="max-w-xs font-body text-sm leading-relaxed text-on-surface-variant">
              A founder-led digital growth studio in the United Kingdom.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { href: "#story", label: "Story" },
                { href: "#services", label: "Services" },
                { href: "#process", label: "Process" },
                { href: "#founder", label: "Founder" },
                { href: "/blog", label: "Journal" },
                { href: "#mockup", label: "Free Mockup" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-body text-sm text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <p className="font-body text-xs text-outline">
            © {new Date().getFullYear()} iDigital World. All rights reserved.
          </p>
          <p className="font-body text-xs text-outline">
            Designed and built in the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}
