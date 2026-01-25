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
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
            <h2 className="card-title text-xl">Data Game</h2>
            <GameSearchInput />
        </div>
        <div className="mt-4 space-y-3">
            {games.length === 0 && (
            <div className="text-sm opacity-50 text-center py-4">Belum ada data</div>
            )}
            {games.map((g) => (
            <a key={g.id} href={`/admin/games?edit=${g.id}`} className="card card-side bg-base-200 hover:bg-base-300 transition-colors border border-base-300 p-2 items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-base-100 overflow-hidden flex items-center justify-center shrink-0 border border-base-300">
                {g.imageUrl ? (
                    <Image src={g.imageUrl} alt={g.name} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-xs opacity-50">No image</div>
                )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{g.name}</div>
                    <div className="text-xs opacity-70 truncate">{g.slug}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className={`badge badge-sm ${g.isActive ? "badge-success" : "badge-ghost"}`}>{g.isActive ? "Aktif" : "Nonaktif"}</span>
                        {g.isHotOffer && <span className="badge badge-sm badge-error text-white">Hot Offer</span>}
                    </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-base-100 overflow-hidden flex items-center justify-center shrink-0 border border-base-300 mr-2">
                {g.iconUrl ? (
                    <Image src={g.iconUrl} alt="icon" width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-[10px] opacity-50">No icon</div>
                )}
                </div>
            </a>
            ))}
        </div>
      </div>
    </div>
  );
}
