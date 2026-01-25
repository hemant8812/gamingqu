 "use client";
 import Image from "next/image";
 import { useRouter } from "next/navigation";
 import { Pencil, Trash2 } from "lucide-react";
 
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
 
 export function ServiceList({ services }: { services: ServiceItem[] }) {
   const router = useRouter();
   const onDelete = async (id: string) => {
     const ok = typeof window !== "undefined" ? window.confirm("Hapus layanan ini?") : true;
     if (!ok) return;
     const fd = new FormData();
     fd.set("id", id);
     const res = await fetch("/api/admin/services", { method: "DELETE", body: fd });
     router.replace(`/admin/services?toast=${res.ok ? "deleted" : "error"}`);
   };
   return (
     <div className="mt-4 space-y-3">
       {services.length === 0 && (
         <div className="text-sm text-zinc-400">Belum ada data</div>
       )}
       {services.map((s) => (
         <div key={s.id} className="flex items-center gap-4 rounded-xl border border-zinc-900 bg-black p-3 hover:bg-zinc-900/40">
           <div className="w-16 h-16 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
             {s.imageUrl ? (
               <Image src={s.imageUrl} alt={s.name} width={64} height={64} className="object-cover w-16 h-16" />
             ) : (
               <div className="text-xs text-zinc-500">No image</div>
             )}
           </div>
           <div className="flex-1">
             <div className="font-semibold">{s.name}</div>
             <div className="text-xs text-zinc-500">{s.game.name}{s.category?.name ? ` • ${s.category.name}` : ""}</div>
             <div className="mt-1 flex items-center gap-2 text-xs">
               <span className={`px-2 py-0.5 rounded-md ${s.isActive ? "bg-green-600" : "bg-zinc-700"} text-white`}>{s.isActive ? "Aktif" : "Nonaktif"}</span>
               {s.isHotOffer && <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white">Hot Offer</span>}
               <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white">${Number(s.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <a
               href={`/admin/services?edit=${s.id}`}
               aria-label="Edit"
               className="inline-flex items-center justify-center rounded-md bg-zinc-800 p-2 hover:bg-zinc-700 text-white"
             >
               <Pencil className="h-4 w-4" />
             </a>
             <button
               aria-label="Hapus"
               onClick={() => onDelete(s.id)}
               className="inline-flex items-center justify-center rounded-md bg-red-600 p-2 hover:bg-red-500 text-white"
             >
               <Trash2 className="h-4 w-4" />
             </button>
           </div>
         </div>
       ))}
     </div>
   );
 }
