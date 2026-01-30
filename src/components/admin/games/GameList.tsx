"use client";
import Image from "next/image";
import { GameSearchInput } from "./GameSearchInput";

type Game = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  iconUrl: string | null;
  isActive: boolean;
  isHotOffer: boolean;
};

export function GameList({ games }: { games: Game[] }) {
  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Game Data</h2>
        <GameSearchInput />
      </div>
      <div className="p-4 space-y-3">
        {games.length === 0 && (
          <div className="text-gray-500 text-center py-12">No games found</div>
        )}
        {games.map((g) => (
          <a
            key={g.id}
            href={`/admin/games?edit=${g.id}`}
            className="flex items-center gap-4 p-3 bg-[#0A0E17] hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {g.imageUrl ? (
                <Image src={g.imageUrl} alt={g.name} width={56} height={56} className="object-cover w-full h-full" />
              ) : (
                <div className="text-xs text-gray-500">No image</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{g.name}</div>
              <div className="text-sm text-gray-500 truncate">{g.slug}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${g.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                  {g.isActive ? "Active" : "Inactive"}
                </span>
                {g.isHotOffer && (
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-red-500/20 text-red-400">
                    Hot Offer
                  </span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {g.iconUrl ? (
                <Image src={g.iconUrl} alt="icon" width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <div className="text-[10px] text-gray-500">No icon</div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
