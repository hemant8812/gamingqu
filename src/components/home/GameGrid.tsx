import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import { ArtImage } from "@/components/art/ArtImage";
import type { HomeGame } from "@/lib/homeData";

// "Choose your game" tiles with the number of services per game.
export function GameGrid({ games, total }: { games: HomeGame[]; total: number }) {
  return (
    <section id="games" className="scroll-mt-24">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Games</p>
        <h2 className="text-2xl font-extrabold text-white md:text-3xl">Choose from {total} games</h2>
      </div>
      {games.length === 0 ? (
        <p className="surface p-8 text-center text-gray-400">New games are being added. Check back soon.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {games.map((g) => (
            <li key={g.slug}>
              <Link href={`/${g.slug}`} className="game-tile group block h-36 md:h-44">
                <ArtImage src={g.imageUrl} alt={g.name} seed={g.slug} className="game-tile-art" imgClassName="game-tile-art" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                {g.isHot && (
                  <span className="chip absolute left-3 top-3 border-accent-400/40 bg-accent-500/85 text-[10px] text-white">
                    <Flame className="h-3 w-3" /> HOT
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white md:text-base">{g.name}</h3>
                    <p className="text-xs text-gray-300">
                      {g.services === 0 ? "Coming soon" : `${g.services} ${g.services === 1 ? "service" : "services"}`}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-brand-500">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
