"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GameList } from "./GameList";
import { GameModal } from "./GameModal";

type Game = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  iconUrl: string | null;
  isActive: boolean;
  isHotOffer: boolean;
  sortOrder: number;
};

type Editing = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  description?: string | null;
  isHotOffer: boolean;
  isActive: boolean;
  sortOrder: number;
} | null;

export function GameManager({ games, editing }: { games: Game[], editing: Editing }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
         <div>
             <h1 className="text-3xl font-bold">Manage Games</h1>
             <p className="mt-2 text-sm opacity-70">
                Add game data: name, auto slug, upload image & icon, description, Hot Offer, active status.
            </p>
         </div>
         <Link href="/admin/games?create=true" className="h-10 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            Add Game
         </Link>
      </div>
      
      <GameList games={games} />
      
      <GameModal editing={editing} />
    </>
  );
}
