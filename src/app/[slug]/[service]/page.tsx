import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { ServiceOptions } from "@/components/services/ServiceOptions";
import { ServicePanel } from "@/components/services/ServicePanel";
import type { Metadata } from "next";
import { Clock, Timer, ShoppingCart, CheckCircle } from "lucide-react";
import { SiStripe, SiVisa, SiAmericanexpress, SiApplepay, SiGooglepay, SiPaypal, SiBitcoin } from "react-icons/si";

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
    const title = `${s.name} - ${s.game.name}`;
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

  // Compute starting price using ServiceDetail if available
  const basePrice = parseFloat(service.price.toString());
  let startingPrice = basePrice;
  let detailsData: Array<{
    id: number;
    title: string;
    fieldName: string;
    inputType: "select" | "radio" | "range" | "checkbox" | "input";
    displayType?: "number" | "text" | "dual" | "single";
    priceType: "fixed" | "percent";
    price: number;
    sortOrder?: number;
    options?: Array<{ label: string; price: number }>;
    range?: { min: number; max: number; step?: number; dual?: boolean };
    inputMeta?: { kind: "text" | "number"; min?: number; max?: number };
  }> = [];
  try {
    detailsData = await db.serviceDetail.findMany({
      where: { serviceId: service.id, isActive: true },
      select: {
        id: true,
        title: true,
        fieldName: true,
        inputType: true,
        displayType: true,
        priceType: true,
        price: true,
        sortOrder: true,
        options: true,
        range: true,
        inputMeta: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
    for (const d of detailsData) {
      if (d.inputType === "select" || d.inputType === "radio") {
        const opts = Array.isArray(d.options as unknown)
          ? (d.options as unknown as Array<{ label: string; price: number }>)
          : [];
        for (const opt of opts) {
          const val = d.priceType === "percent" ? basePrice * (opt.price / 100) : opt.price;
          if (Number.isFinite(val)) {
            startingPrice = Math.min(startingPrice, val);
          }
        }
      } else {
        const p = parseFloat(d.price.toString());
        const val = d.priceType === "percent" ? basePrice * (p / 100) : p;
        if (Number.isFinite(val) && val > 0) {
          startingPrice = Math.min(startingPrice, val);
        }
      }
    }
  } catch {}
  const priceFmt = formatPrice(startingPrice.toString());
  const detailsForClient = detailsData.map((d) => ({
    id: d.id,
    title: d.title,
    fieldName: d.fieldName,
    inputType: d.inputType,
    displayType: d.displayType ?? undefined,
    priceType: d.priceType,
    price: Number.parseFloat(d.price.toString()),
    sortOrder: d.sortOrder,
    options: Array.isArray(d.options as unknown)
      ? (d.options as unknown as Array<{ label: string; price: number }>).map((o) => ({
          label: String(o.label),
          price: Number(o.price),
        }))
      : undefined,
    range:
      (d.range as unknown as { min?: number; max?: number; step?: number; dual?: boolean }) && typeof d.range === "object"
        ? {
            min: Number((d.range as any).min ?? 0),
            max: Number((d.range as any).max ?? 0),
            step: Number((d.range as any).step ?? 1),
            dual: !!(d.range as any).dual,
          }
        : undefined,
    inputMeta:
      (d.inputMeta as unknown as { kind?: "text" | "number"; min?: number; max?: number }) && typeof d.inputMeta === "object"
        ? {
            kind: (d.inputMeta as any).kind === "number" ? "number" : "text",
            min: (d.inputMeta as any).min != null ? Number((d.inputMeta as any).min) : undefined,
            max: (d.inputMeta as any).max != null ? Number((d.inputMeta as any).max) : undefined,
          }
        : undefined,
  }));

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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8">
          <section className="glass-card rounded-2xl p-6">
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

          <ServicePanel details={detailsForClient} priceFmt={priceFmt} serviceSlug={service.slug} basePrice={basePrice} />
        </div>
      </main>
    </div>
  );
}
