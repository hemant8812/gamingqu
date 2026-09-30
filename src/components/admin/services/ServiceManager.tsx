"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ServiceList } from "./ServiceList";
import { ServiceModal } from "./ServiceModal";
import { GameSearchInput } from "@/components/admin/games/GameSearchInput";

type ServiceItem = {
  id: number;
  name: string;
  slug: string;
  price: string;
  isHotOffer: boolean;
  isActive: boolean;
  imageUrl?: string | null;
  game: { id: number; name: string };
  category?: { id: number; name: string } | null;
};

type GameOption = { id: number; name: string };
type CategoryOption = { id: number; name: string; gameId: number };
type Editing = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  gameId: number;
  categoryId?: number | null;
  features?: string[] | null;
  price: string;
  isHotOffer: boolean;
} | null;

export function ServiceManager({ services, games, categories, editing }: { services: ServiceItem[], games: GameOption[], categories: CategoryOption[], editing: Editing }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Services</h1>
          <p className="mt-2 text-gray-400">
            Add/manage services: name, slug, game, category, description, image, features, price, hot offers.
          </p>
        </div>
        <Link href="/admin/services?create=true" className="h-10 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Service
        </Link>
      </div>

      <div className="bg-ink-800 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Service Data</h2>
          <GameSearchInput placeholder="Search services..." />
        </div>
        <ServiceList services={services} />
      </div>

      <ServiceModal editing={editing} games={games} categories={categories} />
    </>
  );
}
