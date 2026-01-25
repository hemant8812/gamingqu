import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function AdminBoostersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-base-200 text-base-content p-8">Forbidden</div>;
  }
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Manage Boosters</h1>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search boosters"
              className="input input-bordered w-64"
            />
            <button className="btn btn-primary">New Application</button>
          </div>
        </div>
        <div className="mt-6">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-10 flex items-center justify-center opacity-50">
                Data table coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
