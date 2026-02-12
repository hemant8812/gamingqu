import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServicePanel } from "@/components/services/ServicePanel";
import type { Metadata } from "next";
import { sanitizePlain } from "@/lib/sanitize";
import { getBaseUrl } from "@/lib/site";
import { TrustBanner } from "@/components/shared/TrustBanner";
import { getWebsiteSettingCore } from "@/lib/settings";

type Params = Promise<{ slug?: string | string[]; service?: string | string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const gameSlug = Array.isArray(p.slug) ? p.slug[0] : p.slug || "";
  const serviceSlug = Array.isArray(p.service) ? p.service[0] : p.service || "";
  if (!gameSlug || !serviceSlug) return {};
  const base = getBaseUrl();
  try {
    const s = await db.service.findFirst({
      where: { slug: serviceSlug, isActive: true, game: { slug: gameSlug, isActive: true } },
      select: { name: true, description: true, imageUrl: true, game: { select: { name: true, slug: true } } },
    });
    if (!s) return {};
    const title = `${s.name} - ${s.game.name}`;
    const desc = sanitizePlain((s.description ?? "").trim()) || `${s.name} for ${s.game.name}`;
    return {
      title,
      description: desc,
      alternates: { canonical: `${base}/${s.game.slug}/${serviceSlug}` },
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

  const setting = await getWebsiteSettingCore();
  const brandName = setting?.siteName ?? "Gamingqu";
  const bannerLogoUrl = setting?.faviconUrl ?? setting?.logoUrl ?? "/icons/logo.png";

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
  let detailsRaw: unknown[] = [];
  try {
    detailsRaw = await db.serviceDetail.findMany({
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
    for (const d of detailsRaw as Array<{
      id: number;
      title: string;
      fieldName: string;
      inputType: string;
      displayType: string | null;
      priceType: string;
      price: number | string;
      sortOrder?: number;
      options?: unknown;
      range?: unknown;
      inputMeta?: unknown;
    }>) {
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
  const detailsForClient = (detailsRaw as Array<{
    id: number;
    title: string;
    fieldName: string;
    inputType: string;
    displayType: string | null;
    priceType: string;
    price: number | string;
    sortOrder?: number;
    options?: unknown;
    range?: unknown;
    inputMeta?: unknown;
  }>).map((d) => ({
    id: d.id,
    title: d.title,
    fieldName: d.fieldName,
    inputType: (d.inputType as "select" | "radio" | "range" | "checkbox" | "input"),
    displayType: d.displayType ? (d.displayType as "number" | "text" | "dual" | "single") : undefined,
    priceType: (d.priceType as "fixed" | "percent"),
    price: Number.parseFloat(d.price.toString()),
    sortOrder: d.sortOrder,
    options: Array.isArray(d.options as unknown)
      ? (d.options as unknown as Array<{ label: string; price: number }>).map((o) => ({
          label: String(o.label),
          price: Number(o.price),
        }))
      : undefined,
    range:
      typeof d.range === "object" && d.range != null
        ? {
            min: Number(((d.range as { min?: number }).min ?? 0)),
            max: Number(((d.range as { max?: number }).max ?? 0)),
            step: Number(((d.range as { step?: number }).step ?? 1)),
            dual: Boolean(((d.range as { dual?: boolean }).dual)),
            items: (() => {
              const r = d.range as { items?: unknown };
              const list = Array.isArray(r.items) ? r.items : undefined;
              if (!list) return undefined;
              const filtered = list.filter(
                (it): it is { min: unknown; max: unknown; price: unknown } =>
                  !!it && typeof it === "object"
              );
              const mapped = filtered
                .map((it) => {
                  const obj = it as { min?: unknown; max?: unknown; price?: unknown };
                  const mn = Number(obj.min);
                  const mx = Number(obj.max);
                  const pr = Number(obj.price);
                  if (!Number.isFinite(mn) || !Number.isFinite(mx) || !Number.isFinite(pr)) return null;
                  return { min: mn, max: mx, price: pr };
                })
                .filter((v): v is { min: number; max: number; price: number } => v != null);
              return mapped.length > 0 ? mapped : undefined;
            })()
          }
        : undefined,
    inputMeta:
      typeof d.inputMeta === "object" && d.inputMeta != null
        ? {
            kind: (((d.inputMeta as { kind?: "text" | "number" }).kind === "number") ? "number" : "text") as "number" | "text",
            min: ((d.inputMeta as { min?: number }).min != null ? Number((d.inputMeta as { min?: number }).min) : undefined),
            max: ((d.inputMeta as { max?: number }).max != null ? Number((d.inputMeta as { max?: number }).max) : undefined),
            required: Boolean(((d.inputMeta as { required?: boolean }).required)),
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
            unoptimized
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
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  <Link href={`/${service.game.slug}`} className="hover:text-white">
                    {service.game.name}
                  </Link>
                </h1>
                <div className="text-sm md:text-base text-gray-300 font-semibold">
                  {service.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8">
          <section>
            {service.description && (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            )}
            <div className="mt-8">
              <TrustBanner brandName={brandName} logoUrl={bannerLogoUrl} />
            </div>
          </section>

          <ServicePanel details={detailsForClient} serviceSlug={service.slug} basePrice={basePrice} />
        </div>
      </main>
    </div>
  );
}
