import Link from "next/link";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function PaginationNumbers({ page, totalPages, basePath = "/admin/orders" }: { page: number; totalPages: number; basePath?: string }) {
  const count = clamp(totalPages, 1, 10);
  const pages = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}?page=${p}`}
          className={`min-w-8 h-8 px-3 inline-flex items-center justify-center rounded-lg text-sm ${p === page ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
          aria-label={`Go to page ${p}`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}
