import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";
import { FiCreditCard, FiTrash2, FiPlus } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { PaymentMethodModal } from "@/components/admin/payment/PaymentMethodModal";
import { db } from "@/lib/prisma";
import { PageToast } from "@/components/shared/PageToast";
import { parseToast } from "@/lib/page-utils";

export default async function AdminPaymentMethodPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const sp = searchParams ? await searchParams : {};
  const { value: toast, type: toastType } = parseToast(sp);
  const toastMessage = toast
    ? toast === "updated"
      ? "Data updated successfully"
      : toast === "deleted"
        ? "Data deleted successfully"
        : toast === "error"
          ? "Failed to save data"
          : "Data saved successfully"
    : undefined;
  const list = await db.paymentMethod.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

 
  async function deleteMethodAction(formData: FormData) {
    "use server";
    const idStr = String(formData.get("id") ?? "");
    const id = Number(idStr);
    if (!Number.isFinite(id) || id <= 0) return;
    await db.paymentMethod.delete({ where: { id } });
    revalidatePath("/admin/payment-method");
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Payment Method</h1>
          <p className="text-gray-400">Manage payment methods and fees</p>
        </div>
        <PageToast message={toastMessage} type={toastType} />
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <FiCreditCard className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold">Payment Methods</div>
                <div className="text-sm text-gray-500">nama, slug, icon, fees</div>
              </div>
              <div className="flex-1" />
              <Link href="/admin/payment-method?create=true" className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md flex items-center gap-2 transition-colors">
                <FiPlus className="h-4 w-4" />
                Add Payment Method
              </Link>
            </div>
            {/* Add form moved into modal */}

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Fee %</th>
                    <th>Fee Fixed</th>
                    <th>Active</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center">
                          {m.iconUrl ? <Image src={m.iconUrl} alt={m.name} width={40} height={40} className="object-cover w-full h-full" /> : <div className="text-[10px] text-gray-500">No icon</div>}
                        </div>
                      </td>
                      <td>{m.name}</td>
                      <td>{m.slug}</td>
                      <td>{m.feePercent != null ? Number.parseFloat(m.feePercent.toString()).toFixed(3) : "-"}</td>
                      <td>{m.feeFixed != null ? Number.parseFloat(m.feeFixed.toString()).toFixed(2) : "-"}</td>
                      <td>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${m.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{m.sortOrder}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/payment-method?edit=${m.id}`} className="btn btn-ghost btn-xs">Edit</Link>
                          <form>
                            <input type="hidden" name="id" defaultValue={m.id} />
                            <button formAction={deleteMethodAction} className="btn btn-error btn-xs">
                              <FiTrash2 className="h-4 w-4" />
                              <span className="ml-1">Delete</span>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr><td colSpan={8} className="text-center text-gray-500 py-6">No payment methods</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <PaymentMethodModal />
      </div>
    </div>
  );
}
