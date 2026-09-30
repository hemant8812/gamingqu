import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { BlogManager } from "@/components/admin/blog/BlogManager";

export default async function AdminBlogPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const sp = searchParams ? await searchParams : {};
  const pageParam = sp?.page;
  const page = typeof pageParam === "string" ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
  const take = 10;
  const total = await db.post.count();
  const totalPages = Math.max(1, Math.ceil(total / take));
  const currentPage = Math.min(page, totalPages);
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * take,
    take,
  });

  const sources = await db.scraperSource.findMany();

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          <p className="text-gray-400">Manage manual posts and auto-scraping sources</p>
        </div>

        <BlogManager posts={posts} sources={sources} page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
