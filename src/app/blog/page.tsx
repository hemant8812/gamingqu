import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site";
import { headers } from "next/headers";

const BLUR_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
export async function generateMetadata({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const base = getBaseUrl();
  const sp = searchParams ? await searchParams : {};
  const pageParam = sp?.page;
  const pageRaw = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const canonical = page > 1 ? `${base}/blog?page=${page}` : `${base}/blog`;
  return {
    title: "Blog",
    description: "Latest articles from our team and official sources.",
    alternates: { canonical },
    openGraph: {
      title: "Blog",
      description: "Latest articles from our team and official sources.",
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog",
      description: "Latest articles from our team and official sources.",
    },
    robots: { index: true, follow: true },
  };
}
export default async function BlogPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = searchParams ? await searchParams : {};
  const pageParam = sp?.page;
  const pageRaw = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const nonce = (await headers()).get("x-nonce") || "";
  const take = 12;
  const total = await db.post.count({ where: { isPublished: true } });
  const totalPages = Math.max(1, Math.ceil(total / take));
  const currentPage = Math.min(page, totalPages);
  const posts = await db.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * take,
    take,
    select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true, sourceUrl: true },
  });
  const base = getBaseUrl();
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/blog/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10">
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Blog</h1>
          <p className="text-base opacity-70 mt-2">Latest articles from our team and official sources.</p>
        </div>
        {posts.length === 0 && (
          <div className="text-center opacity-60">No articles yet.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, idx) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#0F172A] text-white shadow transition-transform hover:-translate-y-0.5"
            >
              <Link href={`/blog/${p.slug}`} className="block">
                <div className="relative w-full h-44">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      priority={idx < 3}
                      quality={70}
                      unoptimized
                    />
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
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                prefetch={false}
                className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              >
                Prev
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold bg-white/5 text-gray-600 pointer-events-none">
                Prev
              </span>
            )}
            {(() => {
              const maxButtons = 5;
              const pages: (number | string)[] = [];
              if (totalPages <= maxButtons) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                pages.push(1);
                if (start > 2) pages.push("...");
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < totalPages - 1) pages.push("...");
                pages.push(totalPages);
              }
              return pages.map((p, i) =>
                typeof p === "number" ? (
                  <Link
                    key={`${p}-${i}`}
                    href={`/blog?page=${p}`}
                    prefetch={false}
                    aria-current={p === currentPage ? "page" : undefined}
                    className={`inline-flex items-center justify-center h-9 min-w-9 px-4 rounded-xl text-sm font-semibold transition-colors ${
                      p === currentPage
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/5 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    {p}
                  </Link>
                ) : (
                  <span key={`dots-${i}`} className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold text-gray-500">
                    …
                  </span>
                )
              );
            })()}
            {currentPage < totalPages ? (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                prefetch={false}
                className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold bg-white/5 text-gray-600 pointer-events-none">
                Next
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
