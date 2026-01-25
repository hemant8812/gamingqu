"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ServiceList } from "./ServiceList";
import { ServiceModal } from "./ServiceModal";
import { GameSearchInput } from "@/components/admin/games/GameSearchInput";

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  price: string;
  isHotOffer: boolean;
  isActive: boolean;
  imageUrl?: string | null;
  game: { id: string; name: string };
  category?: { id: string; name: string } | null;
};

type GameOption = { id: string; name: string };
type CategoryOption = { id: string; name: string; gameId: string };
type Editing = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  gameId: string;
  categoryId?: string | null;
  features?: string[] | null;
  price: string;
  isHotOffer: boolean;
} | null;

export function ServiceManager({ services, games, categories, editing }: { services: ServiceItem[], games: GameOption[], categories: CategoryOption[], editing: Editing }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
         <div>
             <h1 className="text-3xl font-bold">Manage Layanan</h1>
             <p className="mt-2 text-sm opacity-70">
                Tambah/kelola layanan: nama, slug, pilih game dan kategori opsional, deskripsi, gambar, features, harga, hot offers.
            </p>
         </div>
         <Link href="/admin/services?create=true" className="btn btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Tambah Layanan
         </Link>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Data Layanan</h2>
            <GameSearchInput placeholder="Cari layanan" />
        </div>
        <ServiceList services={services} />
      </div>
      
      <ServiceModal editing={editing} games={games} categories={categories} />
    </>
  );
}
