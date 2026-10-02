import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { db } from "@/lib/prisma";
import { ArtImage } from "@/components/art/ArtImage";

export const metadata: Metadata = {
  title: "Search boosts",
  robots: { index: false, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().slice(0, 80);

  const results = q
    ? await db.service
        .findMany({
          where: {
            isActive: true,
            game: { isActive: true },
            OR: [{ name: { contains: q } }, { slug: { contains: q.toLowerCase().replace(/\s+/g, "-") } }, { game: { name: { contains: q } } }],
          },
          orderBy: [{ isHotOffer: "desc" }, { name: "asc" }],
          take: 48,
          select: { id: true, name: true, slug: true, price: true, imageUrl: true, game: { select: { name: true, slug: true } } },
        })
        .catch(() => [])
    : [];

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold">{q ? <>Results for “{q}”</> : "Find your boost"}</h1>
        <form action="/search" method="get" role="search" className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-ink-800 p-2">
          <Search className="ml-3 h-5 w-5 shrink-0 text-brand-300" aria-hidden="true" />
          <label htmlFor="search-q" className="sr-only">Search</label>
          <input id="search-q" name="q" defaultValue={q} placeholder="Game or service name" className="h-11 min-w-0 flex-1 bg-transparent px-2 text-white placeholder-gray-500 focus:outline-none" />
          <button type="submit" className="btn btn-gaming h-11 rounded-xl px-5">Search</button>
        </form>

        {q && results.length === 0 && (
          <p className="surface mt-8 p-8 text-center text-gray-400">
            Nothing matches “{q}”. Try a game name like “Diablo” or a service like “leveling”, or <Link href="/#games" className="text-brand-300 underline">browse all games</Link>.
          </p>
        )}

        {results.length > 0 && (
          <>
            <p className="mt-6 text-sm text-gray-400">{results.length} {results.length === 1 ? "result" : "results"}</p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s) => (
                <li key={s.id}>
                  <Link href={`/${s.game.slug}/${s.slug}`} className="game-tile group flex h-full flex-col bg-ink-800">
                    <div className="relative h-36 overflow-hidden">
                      <ArtImage src={s.imageUrl} alt="" seed={s.slug} className="game-tile-art" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 items-end justify-between gap-3 p-4 pt-2">
                      <div className="min-w-0">
                        <div className="truncate text-xs text-brand-300">{s.game.name}</div>
                        <div className="line-clamp-2 font-bold text-white group-hover:text-brand-200">{s.name}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] uppercase tracking-wider text-gray-500">From</div>
                        <div className="font-display text-lg font-bold">${Number.parseFloat(String(s.price)).toFixed(2)}</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
