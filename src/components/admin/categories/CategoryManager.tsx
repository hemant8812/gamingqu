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
          <h1 className="text-3xl font-bold text-white">Manage Categories</h1>
          <p className="mt-2 text-gray-400">
            Category form: name, auto slug, select game.
          </p>
        </div>
        <Link href="/admin/categories?create=true" className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Category Data</h2>
          <GameSearchInput placeholder="Search categories..." />
        </div>
        <CategoryList categories={categories} />
      </div>

      <CategoryModal editing={editing} games={games} />
    </>
  );
}
