import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { db } from "@/lib/prisma";

// Blog teaser: a call-out card plus the newest guides.
export async function LatestGuides() {
  const posts = await db.post
    .findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { slug: true, title: true, createdAt: true },
    })
    .catch(() => []);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="guides-title" className="grid gap-4 md:grid-cols-[1fr_1.6fr]">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-brand-500/30 bg-gradient-to-br from-brand-800/70 via-ink-800 to-accent-900/40 p-7">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative">
          <BookOpen className="h-9 w-9 text-brand-200" aria-hidden="true" />
          <h2 id="guides-title" className="mt-4 text-2xl font-extrabold text-white">Guides from pro players</h2>
          <p className="mt-2 text-sm text-gray-300">Patch notes, leveling routes and farming tips, written by the people who boost every day.</p>
          <Link href="/blog" className="btn btn-gaming mt-6 h-11 rounded-xl px-6">Read the blog</Link>
        </div>
      </div>
      <div className="surface p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Latest</h3>
        <ul className="divide-y divide-white/[0.06]">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="line-clamp-1 font-semibold text-white group-hover:text-brand-200">{p.title}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-white" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
