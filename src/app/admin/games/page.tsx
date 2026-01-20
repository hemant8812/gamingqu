import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { promises as fs } from "fs";
import Image from "next/image";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUploadField } from "@/components/ImageUploadField";
import { AutoSlugField } from "@/components/AutoSlugField";
import { Save as SaveIcon } from "lucide-react";
import { PageToast } from "@/components/PageToast";
import { GameSearchInput } from "@/components/GameSearchInput";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function saveFile(file: File | null, slug: string, kind: "image" | "icon"): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "games");
  await fs.mkdir(uploadDir, { recursive: true });
  const name = file.name || `${kind}.bin`;
  const ext = path.extname(name) || ".bin";
  const filename = `${slug}-${kind}-${Date.now()}${ext}`;
  const content = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), content);
  return `/uploads/games/${filename}`;
}

async function getGames(q?: string) {
  const list = await db.game.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : undefined,
  });
  return list;
}

export default async function AdminGamesPage({ searchParams }: { searchParams?: Promise<{ edit?: string }> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return <div className="min-h-screen bg-black text-white p-8">Forbidden</div>;
  }

  async function createGame(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const inputSlug = (formData.get("slug") as string | null) ?? "";
    const isHotOffer = formData.get("isHotOffer") === "on";
    const isActive = formData.get("isActive") === "on";
    const imageFile = formData.get("image") as File | null;
    const iconFile = formData.get("icon") as File | null;
    let baseSlug = slugify(inputSlug || name || "");
    if (baseSlug.length > 60) {
      baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
    }
    let slug = baseSlug || `game-${Date.now()}`;

    const existing = await db.game.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const imageUrl = await saveFile(imageFile, slug, "image");
    const iconUrl = await saveFile(iconFile, slug, "icon");

    await db.game.create({
      data: {
        name,
        slug,
        description: description || undefined,
        imageUrl,
        iconUrl,
        isHotOffer,
        isActive,
      },
    });
    revalidatePath("/admin/games");
    redirect("/admin/games?toast=saved");
  }

  async function updateGame(formData: FormData) {
    "use server";
    const id = (formData.get("id") as string | null) ?? "";
    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const inputSlug = (formData.get("slug") as string | null) ?? "";
    const isHotOffer = formData.get("isHotOffer") === "on";
    const isActive = formData.get("isActive") === "on";
    const imageFile = formData.get("image") as File | null;
    const iconFile = formData.get("icon") as File | null;
    if (!id) return;
    const current = await db.game.findUnique({ where: { id } });
    if (!current) return;
    let baseSlug = slugify(inputSlug || name || current.name || "");
    if (baseSlug.length > 60) {
      baseSlug = baseSlug.slice(0, 60).replace(/-+$/, "");
    }
    let slug = baseSlug || current.slug;
    const existing = await db.game.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const imageUrl = await saveFile(imageFile, slug, "image");
    const iconUrl = await saveFile(iconFile, slug, "icon");
    await db.game.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || undefined,
        imageUrl: imageUrl ?? current.imageUrl,
        iconUrl: iconUrl ?? current.iconUrl,
        isHotOffer,
        isActive,
      },
    });
    revalidatePath("/admin/games");
    redirect("/admin/games?toast=updated");
  }
  const sp = searchParams ? await searchParams : undefined;
  const q = (sp as any)?.q ? String((sp as any).q) : "";
  const games = await getGames(q.trim() || undefined);
  const editId = sp?.edit ?? null;
  const editing = editId ? await db.game.findUnique({ where: { id: editId } }) : null;
  const toastParam = (sp as any)?.toast as string | undefined;
  const toastMessage = toastParam ? (toastParam === "updated" ? "Data berhasil diupdate" : "Data berhasil disimpan") : undefined;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageToast message={toastMessage} />
        <h1 className="text-3xl font-bold">Manage Games</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tambah data game: nama, slug otomatis, upload gambar & icon, deskripsi, Hot Offer, status aktif.
        </p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <form action={editing ? updateGame : createGame} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">Nama Game</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Contoh: World of Warcraft"
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
                defaultValue={editing?.name ?? ""}
              />
              <AutoSlugField nameInputId="name" name="slug" label="Slug" initialValue={editing?.slug ?? ""} />
              {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} initialUrl={editing?.imageUrl ?? null} />
              <ImageUploadField id="icon" name="icon" label="Icon" previewHeight={160} initialUrl={editing?.iconUrl ?? null} />
            </div>
            <div>
              <label className="block text-sm font-semibold">Deskripsi</label>
              <div className="mt-1">
                <RichTextEditor name="description" placeholder="Deskripsi dan format bebas" initialHtml={editing?.description ?? ""} />
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Gunakan toolbar di atas untuk Bold, Link, garis baru, dan menyisipkan gambar via URL.
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <input id="isHotOffer" name="isHotOffer" type="checkbox" className="peer sr-only" defaultChecked={editing?.isHotOffer ?? false} />
                <label
                  htmlFor="isHotOffer"
                  className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
                  aria-label="Hot Offer"
                >
                </label>
                <span className="text-sm font-semibold">Hot Offer</span>
              </div>
              <div className="flex items-center gap-3">
                <input id="isActive" name="isActive" type="checkbox" className="peer sr-only" defaultChecked={editing?.isActive ?? true} />
                <label
                  htmlFor="isActive"
                  className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer after:content-[''] after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
                  aria-label="Aktif"
                >
                </label>
                <span className="text-sm font-semibold">Aktif</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                <SaveIcon className="h-4 w-4" />
                <span>{editing ? "Update Data" : "Simpan Game"}</span>
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Data Game</h2>
              <GameSearchInput />
            </div>
            <div className="mt-4 space-y-3">
              {games.length === 0 && (
                <div className="text-sm text-zinc-400">Belum ada data</div>
              )}
              {games.map((g) => (
                <a key={g.id} href={`/admin/games?edit=${g.id}`} className="flex items-center gap-4 rounded-xl border border-zinc-900 bg-black p-3 hover:bg-zinc-900/40">
                  <div className="w-16 h-16 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {g.imageUrl ? (
                      <Image src={g.imageUrl} alt={g.name} width={64} height={64} className="object-cover w-16 h-16" />
                    ) : (
                      <div className="text-xs text-zinc-500">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{g.name}</div>
                    <div className="text-xs text-zinc-500">{g.slug}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-md ${g.isActive ? "bg-green-600" : "bg-zinc-700"} text-white`}>{g.isActive ? "Aktif" : "Nonaktif"}</span>
                      {g.isHotOffer && <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white">Hot Offer</span>}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {g.iconUrl ? (
                      <Image src={g.iconUrl} alt="icon" width={40} height={40} className="object-cover w-10 h-10" />
                    ) : (
                      <div className="text-[10px] text-zinc-500">No icon</div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
