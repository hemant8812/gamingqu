import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true, sourceUrl: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10">
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Blog</h1>
        <p className="text-base opacity-70 mt-2">Latest articles from our team and official sources.</p>
      </div>
      {posts.length === 0 && (
        <div className="text-center opacity-60">No articles yet.</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow transition-transform hover:-translate-y-0.5">
            <Link href={`/blog/${p.slug}`} className="block">
              <div className="relative w-full h-44">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-base-300" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <div className="mb-2 text-xs opacity-60">{new Date(p.createdAt).toLocaleDateString()}</div>
                <h2 className="font-semibold text-lg leading-tight">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="text-sm opacity-80 mt-2">
                    {p.excerpt} <span className="text-primary font-medium">Read more →</span>
                  </p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
