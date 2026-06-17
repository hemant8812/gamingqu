"use client";
import Image from "next/image";
import { GameSearchInput } from "./GameSearchInput";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";

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

export function GameList({ games }: { games: Game[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Game[]>(games);
  const [draggableId, setDraggableId] = useState<number | null>(null);
  const dragStartIdx = useRef<number | null>(null);

  useEffect(() => {
    setItems(games);
  }, [games]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragStartIdx.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragStartIdx.current === null || dragStartIdx.current === index) return;

    const newItems = [...items];
    const draggedItem = newItems[dragStartIdx.current];
    newItems.splice(dragStartIdx.current, 1);
    newItems.splice(index, 0, draggedItem);

    dragStartIdx.current = index;
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    dragStartIdx.current = null;
    setDraggableId(null);

    try {
      const ids = items.map((item) => item.id);
      const res = await fetch("/api/admin/games/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save reordered list:", err);
    }
  };

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Game Data</h2>
        <GameSearchInput />
      </div>
      <div className="p-4 space-y-3">
        {items.length === 0 && (
          <div className="text-gray-500 text-center py-12">No games found</div>
        )}
        {items.map((g, index) => (
          <div
            key={g.id}
            onClick={() => { if (dragStartIdx.current === null) { router.push(`/admin/games?edit=${g.id}`); } }}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 p-3 bg-[#0A0E17] hover:bg-white/5 rounded-xl transition-all duration-200 border border-transparent select-none cursor-pointer ${
              dragStartIdx.current === index ? "opacity-40 scale-[0.98] border-blue-500/30" : "opacity-100"
            }`}
          >
            {/* Drag Handle */}
            <div
              onPointerDown={() => setDraggableId(g.id)}
              onPointerUp={() => setDraggableId(null)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-gray-300 transition-colors shrink-0"
              title="Drag to reorder"
            >
              <GripVertical className="h-4.5 w-4.5" />
            </div>

            {/* Game Image */}
            <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {g.imageUrl ? (
                <Image src={g.imageUrl} alt={g.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
              ) : (
                <div className="text-xs text-gray-500">No image</div>
              )}
            </div>

            {/* Game Info */}
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

            {/* Game Icon */}
            <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {g.iconUrl ? (
                <Image src={g.iconUrl} alt="icon" width={40} height={40} className="object-cover w-full h-full" unoptimized />
              ) : (
                <div className="text-[10px] text-gray-500">No icon</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
