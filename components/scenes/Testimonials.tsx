import { listPublishedTestimonials } from "@/lib/db";
import Reveal from "@/components/ui/Reveal";
import TestimonialsCarousel from "@/components/ui/TestimonialsCarousel";

export default function Testimonials() {
  const testimonials = listPublishedTestimonials();
  if (testimonials.length === 0) return null;

  const ratingValue = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  // Schema.org Review/AggregateRating markup for Google rich results — built only
  // from testimonials genuinely submitted and approved through the admin panel.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://idigitalworld.example.com/#organization",
    name: "iDigital World",
    url: "https://idigitalworld.example.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount: testimonials.length,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.client_name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.quote,
      datePublished: new Date(t.created_at + "Z").toISOString(),
    })),
  };

  return (
    <section id="testimonials" className="relative overflow-hidden py-28 md:py-36">
      <div className="ambient-glow -left-40 top-1/3 h-[480px] w-[480px] bg-secondary-container/15" />

      <div className="relative mx-auto max-w-container px-5 md:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="label-caps">What clients say</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-headline text-on-surface md:text-5xl">
            Real feedback, from real clients.
          </h2>
        </Reveal>

        <TestimonialsCarousel testimonials={testimonials} />
      </div>

      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
