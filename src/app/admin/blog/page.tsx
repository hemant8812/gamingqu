import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { BlogManager } from "@/components/admin/blog/BlogManager";

export default async function AdminBlogPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
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
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
        <p className="text-sm opacity-70 mb-8">Manage manual posts and auto-scraping sources.</p>
        
        <BlogManager posts={posts} sources={sources} page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
