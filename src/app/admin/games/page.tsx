import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { promises as fs } from "fs";
import Image from "next/image";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUploadField } from "@/components/ImageUploadField";
import { AutoSlugField } from "@/components/AutoSlugField";

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

async function getGames() {
  const list = await db.game.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return list;
}

export default async function AdminGamesPage() {
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
  }

  const games = await getGames();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">Manage Games</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tambah data game: nama, slug otomatis, upload gambar & icon, deskripsi, Hot Offer, status aktif.
        </p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <form action={createGame} encType="multipart/form-data" className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">Nama Game</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Contoh: World of Warcraft"
                className="mt-1 w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white"
              />
              <AutoSlugField nameInputId="name" name="slug" label="Slug" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField id="image" name="image" label="Gambar" previewHeight={160} />
              <ImageUploadField id="icon" name="icon" label="Icon" previewHeight={160} />
            </div>
            <div>
              <label className="block text-sm font-semibold">Deskripsi</label>
              <div className="mt-1">
                <RichTextEditor name="description" placeholder="Deskripsi dan format bebas" />
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Gunakan toolbar di atas untuk Bold, Link, garis baru, dan menyisipkan gambar via URL.
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <input id="isHotOffer" name="isHotOffer" type="checkbox" className="peer sr-only" />
                <label
                  htmlFor="isHotOffer"
                  className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-orange-600 transition-colors cursor-pointer"
                  aria-label="Hot Offer"
                >
                  <span className="absolute left-[2px] top-1/2 -translate-y-1/2 size-5 rounded-full bg-white transition-transform peer-checked:translate-x-[calc(100%-2px)]" />
                </label>
                <span className="text-sm font-semibold">Hot Offer</span>
              </div>
              <div className="flex items-center gap-3">
                <input id="isActive" name="isActive" type="checkbox" defaultChecked className="peer sr-only" />
                <label
                  htmlFor="isActive"
                  className="relative inline-flex h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-green-600 transition-colors cursor-pointer"
                  aria-label="Aktif"
                >
                  <span className="absolute left-[2px] top-1/2 -translate-y-1/2 size-5 rounded-full bg-white transition-transform peer-checked:translate-x-[calc(100%-2px)]" />
                </label>
                <span className="text-sm font-semibold">Aktif</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Simpan Game
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Terbaru</h2>
            <div className="mt-4 space-y-3">
              {games.length === 0 && (
                <div className="text-sm text-zinc-400">Belum ada data</div>
              )}
              {games.map((g) => (
                <div key={g.id} className="flex items-center gap-4 rounded-xl border border-zinc-900 bg-black p-3">
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
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
