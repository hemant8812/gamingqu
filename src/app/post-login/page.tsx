import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = session?.user?.role;

  if (!session?.user) {
    redirect("/login");
  }

  if (role === "BOOSTER") {
    redirect("/booster");
  }

  if (role === "MEMBER") {
    redirect("/dashboard");
  }

  if (role === "ADMIN" || role === "SUPERADMIN") {
    redirect("/admin");
  }

  redirect("/");
}

