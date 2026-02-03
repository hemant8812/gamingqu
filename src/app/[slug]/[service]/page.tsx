import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug?: string | string[]; service?: string | string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const gameSlug = Array.isArray(p.slug) ? p.slug[0] : p.slug || "";
  const serviceSlug = Array.isArray(p.service) ? p.service[0] : p.service || "";
  if (!gameSlug || !serviceSlug) return {};
  try {
    const s = await db.service.findFirst({
      where: { slug: serviceSlug, isActive: true, game: { slug: gameSlug, isActive: true } },
      select: { name: true, description: true, imageUrl: true, game: { select: { name: true, slug: true } } },
    });
    if (!s) return {};
    const title = `${s.name} — ${s.game.name}`;
    const desc = (s.description ?? "").trim() || `${s.name} for ${s.game.name}`;
    return {
      title,
      description: desc,
      openGraph: { title, description: desc },
      twitter: { card: "summary_large_image", title, description: desc },
      robots: { index: true, follow: true },
    };
  } catch {
    return {};
  }
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const p = await params;
  const gameSlug = Array.isArray(p.slug) ? p.slug[0] : p.slug || "";
  const serviceSlug = Array.isArray(p.service) ? p.service[0] : p.service || "";
  if (!gameSlug || !serviceSlug) {
    notFound();
  }

  const service = await db.service.findFirst({
    where: { slug: serviceSlug, isActive: true, game: { slug: gameSlug, isActive: true } },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      features: true,
      price: true,
      isHotOffer: true,
      game: { select: { id: true, name: true, slug: true, iconUrl: true, imageUrl: true } },
    },
  });

  if (!service) {
    notFound();
  }

  const priceFmt = formatPrice(service.price.toString());

  return (
    <div className="min-h-screen mesh-gradient text-base-content">
      <div className="particles" />
      <div className="relative h-[220px] overflow-hidden">
        {service.game.imageUrl && (
          <Image
            src={service.game.imageUrl}
            alt={service.game.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17]/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-10 w-full">
            <div className="flex items-center gap-4">
              {service.game.iconUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 shrink-0">
                  <Image
                    src={service.game.iconUrl}
                    alt={service.game.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    quality={100}
                    unoptimized
                  />
                </div>
              )}
              <div>
                <div className="text-sm text-gray-400">
                  <Link href={`/${service.game.slug}`} className="hover:text-white font-semibold">
                    {service.game.name}
                  </Link>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {service.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          <section className="glass-card rounded-2xl p-6">
            {service.imageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6">
                <Image src={service.imageUrl} alt={service.name} fill className="object-cover" sizes="800px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
              </div>
            )}
            {service.description && (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            )}
            {Array.isArray(service.features) && service.features.length > 0 && (
              <div className="mt-6">
                <div className="text-white font-bold mb-2">Features</div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {service.features.slice(0, 10).map((f: unknown, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{String(f)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-1">Starting from</div>
              <div className="text-3xl font-black text-white">
                <span className="gradient-text">{priceFmt.whole}</span>
                {priceFmt.showDecimal && <span className="text-lg ml-1">,{priceFmt.decimal}</span>}
                <span className="text-white/80 text-xl ml-2">€</span>
              </div>
              <Link
                href={`/checkout/${service.slug}`}
                className="btn btn-gaming btn-wide mt-4 rounded-xl"
              >
                Buy now
              </Link>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="font-semibold mb-2">Need Help?</div>
              <p className="text-sm opacity-80">
                Our team can explain this service and how it works.
              </p>
              <Link href="/blog" className="btn btn-ghost btn-sm mt-4">
                Read our blog
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
