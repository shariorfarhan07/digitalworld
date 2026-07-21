import { getReviewLink } from "@/lib/db";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

export default function ReviewPage({ params }: { params: { token: string } }) {
  const link = getReviewLink(params.token);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 md:px-8">
      <div className="ambient-glow left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 bg-secondary-container/20" />
      <div className="glass relative w-full max-w-lg rounded-2xl p-8 md:p-10">
        {!link || link.used ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
            <h1 className="font-display text-2xl font-semibold text-on-surface">
              This link isn&rsquo;t available
            </h1>
            <p className="max-w-xs font-body text-base text-on-surface-variant">
              {link
                ? "This review link has already been used."
                : "This review link is invalid or has expired."}
            </p>
          </div>
        ) : (
          <ReviewForm token={params.token} />
        )}
      </div>
    </main>
  );
}
