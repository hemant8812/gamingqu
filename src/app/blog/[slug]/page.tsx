import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug?: string | string[] }> };

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: Props) {
  const p = await params;
  const slugParam = Array.isArray(p?.slug) ? p!.slug[0] : p?.slug;
  if (!slugParam) return notFound();
  const post = await db.post.findUnique({
    where: { slug: slugParam },
    select: { id: true, title: true, slug: true, excerpt: true, content: true, imageUrl: true, sourceUrl: true, createdAt: true },
  });
  if (!post) return notFound();

  const others = await db.post.findMany({
    where: { isPublished: true, NOT: { slug: slugParam } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true, sourceUrl: true },
    take: 20,
  });
  const related = others.sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14">
      <div className="relative w-full h-72 overflow-hidden rounded-2xl mb-8">
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-base-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="text-xs opacity-80">{new Date(post.createdAt).toLocaleString()}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">{post.title}</h1>
        </div>
      </div>

      <div className="w-full">
        {post.content ? (
          <div className="prose prose-lg prose-invert max-w-none">
            <p>{post.content}</p>
          </div>
        ) : post.excerpt ? (
          <p className="opacity-80">{post.excerpt}</p>
        ) : null}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">You might also like</h3>
          <Link href="/blog" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="block overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow hover:-translate-y-0.5 transition-transform">
              <div className="relative w-full h-36">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-base-300" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <div className="text-xs opacity-60">{new Date(p.createdAt).toLocaleDateString()}</div>
                <div className="font-semibold mt-1">{p.title}</div>
                {p.excerpt && <div className="text-xs opacity-80 mt-1 line-clamp-2">{p.excerpt}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
