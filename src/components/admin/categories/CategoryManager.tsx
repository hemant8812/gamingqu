"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoryList } from "./CategoryList";
import { CategoryModal } from "./CategoryModal";
import { GameSearchInput } from "@/components/admin/games/GameSearchInput";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  game: { id: string; name: string; iconUrl: string | null };
};

type GameOption = { id: string; name: string };
type Editing = {
  id: string;
  name: string;
  slug: string;
  gameId: string;
  isActive: boolean;
} | null;

export function CategoryManager({ categories, games, editing }: { categories: CategoryItem[], games: GameOption[], editing: Editing }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
         <div>
             <h1 className="text-3xl font-bold">Manage Kategori</h1>
             <p className="mt-2 text-sm opacity-70">
                Form kategori: nama, slug otomatis, pilih game.
            </p>
         </div>
         <Link href="/admin/categories?create=true" className="btn btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kategori
         </Link>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Data Kategori</h2>
            <GameSearchInput placeholder="Cari kategori" />
        </div>
        <CategoryList categories={categories} />
      </div>
      
      <CategoryModal editing={editing} games={games} />
    </>
  );
}
