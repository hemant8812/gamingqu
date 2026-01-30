"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GameList } from "./GameList";
import { GameModal } from "./GameModal";

type Game = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  iconUrl: string | null;
  isActive: boolean;
  isHotOffer: boolean;
};

type Editing = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  description?: string | null;
  isHotOffer: boolean;
  isActive: boolean;
} | null;

export function GameManager({ games, editing }: { games: Game[], editing: Editing }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
         <div>
             <h1 className="text-3xl font-bold">Manage Games</h1>
             <p className="mt-2 text-sm opacity-70">
                Tambah data game: nama, slug otomatis, upload gambar & icon, deskripsi, Hot Offer, status aktif.
            </p>
         </div>
         <Link href="/admin/games?create=true" className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            Add Game
         </Link>
      </div>
      
      <GameList games={games} />
      
      <GameModal editing={editing} />
    </>
  );
}
