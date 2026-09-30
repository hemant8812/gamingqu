 "use client";
 import { useEffect, useRef, useState } from "react";
 import { useRouter } from "next/navigation";
 import { Search as SearchIcon } from "lucide-react";
 
 type CurrentFilter = "ALL" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
 
 export function OrdersSearchInput({
   initialQ,
   currentFilter,
   orderCode,
 }: {
   initialQ: string;
   currentFilter: CurrentFilter;
   orderCode?: string;
 }) {
   const [q, setQ] = useState(initialQ);
   const router = useRouter();
   const timer = useRef<number | null>(null);
 
   useEffect(() => {
     if (timer.current) {
       window.clearTimeout(timer.current);
     }
     timer.current = window.setTimeout(() => {
       const params = new URLSearchParams();
       const val = q.trim();
       if (val.length > 0) params.set("q", val);
       if (currentFilter !== "ALL") params.set("filter", currentFilter);
       if (orderCode) params.set("order", orderCode);
       const qs = params.toString();
       router.replace(qs.length > 0 ? `/dashboard/orders?${qs}` : `/dashboard/orders`);
     }, 250);
     return () => {
       if (timer.current) {
         window.clearTimeout(timer.current);
         timer.current = null;
       }
     };
   }, [q, currentFilter, orderCode, router]);
 
   return (
     <div className="relative w-80 max-w-full">
       <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
       <input
         value={q}
         onChange={(e) => setQ(e.target.value)}
         type="text"
         placeholder="Search by order code or service..."
         className="w-full pl-9 pr-3 h-10 bg-ink-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-colors"
         aria-label="Search orders"
       />
     </div>
   );
 }
