import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Card } from "@/components/ui/card";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-zinc-900 p-6">
            <div className="text-zinc-400 text-sm">Revenue Overview</div>
            <div className="mt-4 h-40 bg-zinc-900 rounded-xl" />
          </Card>
          <Card className="rounded-2xl border-zinc-900 p-6">
            <div className="text-zinc-400 text-sm">Orders by Game</div>
            <div className="mt-4 h-40 bg-zinc-900 rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
