import { Star } from "lucide-react";
import { db } from "@/lib/prisma";

// Real, published customer reviews. Hidden until there are some.
export async function PlayerReviews() {
  const reviews = await db.review
    .findMany({
      where: { isPublished: true, rating: { gte: 4 }, comment: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, rating: true, title: true, comment: true, createdAt: true, user: { select: { username: true } }, service: { select: { name: true } } },
    })
    .catch(() => []);
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Reviews</p>
        <h2 id="reviews-title" className="text-2xl font-extrabold text-white md:text-3xl">What players say</h2>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.id} className="surface flex flex-col p-5">
            <div className="flex" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-600"}`} aria-hidden="true" />
              ))}
            </div>
            {r.title && <h3 className="mt-3 font-bold text-white">{r.title}</h3>}
            <p className="mt-2 line-clamp-5 flex-1 text-sm text-gray-300">{r.comment}</p>
            <p className="mt-4 text-xs text-gray-500">
              {r.user.username}
              {r.service?.name ? ` · ${r.service.name}` : ""} · {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
