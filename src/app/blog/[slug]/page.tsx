import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

type Props = { params: Promise<{ slug?: string | string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const slugParam = Array.isArray(p?.slug) ? p!.slug[0] : p?.slug;
  if (!slugParam) return {};
  const { base } = await getSiteMeta();
  try {
    const post = await db.post.findUnique({
      where: { slug: slugParam },
      select: { title: true, excerpt: true, imageUrl: true, updatedAt: true },
    });
    if (!post) return {};
    const description = post.excerpt ?? post.title;
    return {
      title: post.title,
      description,
      alternates: { canonical: `/blog/${slugParam}` },
      openGraph: {
        title: post.title,
        description,
        url: `${base}/blog/${slugParam}`,
        type: "article",
        images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: post.imageUrl ? [post.imageUrl] : undefined,
      },
    };
  } catch {
    return {};
  }
}
export default async function BlogDetailPage({ params }: Props) {
  const p = await params;
  const slugParam = Array.isArray(p?.slug) ? p!.slug[0] : p?.slug;
  if (!slugParam) return notFound();
  const post = await db.post.findUnique({
    where: { slug: slugParam },
    select: { id: true, title: true, slug: true, excerpt: true, content: true, imageUrl: true, sourceUrl: true, createdAt: true, updatedAt: true },
  });
  if (!post) return notFound();

  const others = await db.post.findMany({
    where: { isPublished: true, NOT: { slug: slugParam } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true, sourceUrl: true },
    take: 20,
  });
  const related = others.slice(0, 4);

  const { base, siteName, logo } = await getSiteMeta();
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: new Date(post.createdAt).toISOString(),
            dateModified: new Date(post.updatedAt ?? post.createdAt).toISOString(),
            image: post.imageUrl ? [post.imageUrl] : undefined,
            mainEntityOfPage: `${base}/blog/${post.slug}`,
            author: { "@type": "Organization", name: siteName },
            publisher: {
              "@type": "Organization",
              name: siteName,
              url: base,
              logo: { "@type": "ImageObject", url: logo },
            },
            description: post.excerpt ?? post.title,
            articleBody: post.content ?? post.excerpt ?? post.title,
          },
          breadcrumbLd([
            { name: "Home", url: `${base}/` },
            { name: "Blog", url: `${base}/blog` },
            { name: post.title, url: `${base}/blog/${post.slug}` },
          ]),
        ]}
      />
      <div className="relative w-full h-72 overflow-hidden rounded-2xl mb-8">
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-base-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="text-xs text-white">{new Date(post.createdAt).toLocaleString()}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">{post.title}</h1>
        </div>
      </div>

      <div className="w-full">
        {post.content ? (
          <div className="prose prose-lg prose-invert max-w-none">
            <p>{post.content}</p>
          </div>
        ) : post.excerpt ? (
          <p className="text-white">{post.excerpt}</p>
        ) : null}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">You might also like</h3>
          <Link href="/blog" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="block overflow-hidden rounded-xl border border-white/10 bg-ink-800 text-white shadow hover:-translate-y-0.5 transition-transform"
            >
              <div className="relative w-full h-36">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-base-300" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <div className="text-xs text-white">{new Date(p.createdAt).toLocaleDateString()}</div>
                <div className="font-semibold mt-1 text-white">{p.title}</div>
                {p.excerpt && <div className="text-xs text-white mt-1 line-clamp-2">{p.excerpt}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
