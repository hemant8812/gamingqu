import { Search, Star, ShieldCheck, Clock } from "lucide-react";

// Top of the homepage: one clear promise, a search box and trust signals.
export function HomeHero({ gameCount }: { gameCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="hero-halo" />
      <div className="hero-rings" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-900" />
      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 md:pb-20 md:pt-24">
        <p className="eyebrow mb-4">Pro boosting · Fair prices · Real players</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl">
          Skip the grind. <span className="gradient-text">Play the fun part.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-300 md:text-lg">
          Verified pros level, gear and rank your account in {gameCount} games while you do something you enjoy.
        </p>

        <form action="/search" method="get" role="search" className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-ink-800/80 p-2 shadow-[0_20px_60px_-25px_rgba(124,92,255,0.8)] backdrop-blur">
          <Search className="ml-3 h-5 w-5 shrink-0 text-brand-300" aria-hidden="true" />
          <label htmlFor="home-search" className="sr-only">Find your boost</label>
          <input
            id="home-search"
            name="q"
            placeholder="Find your boost — e.g. power leveling, raids, gold"
            className="h-12 min-w-0 flex-1 bg-transparent px-2 text-base text-white placeholder-gray-500 focus:outline-none"
          />
          <button type="submit" className="btn btn-gaming h-12 rounded-xl px-6 text-base">Search</button>
        </form>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <b className="text-white">4.9/5</b> from customers
          </li>
          <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-lime-glow" /> Money-back guarantee</li>
          <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-300" /> Orders start in minutes</li>
        </ul>
      </div>
    </section>
  );
}
