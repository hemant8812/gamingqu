import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { promises as fs } from "fs";

async function saveBrandFile(file: File | null, kind: "logo" | "favicon"): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "branding");
  await fs.mkdir(uploadDir, { recursive: true });
  const name = file.name || `${kind}.bin`;
  const ext = path.extname(name) || ".bin";
  const filename = `site-${kind}-${Date.now()}${ext}`;
  const content = Buffer.from(await file.arrayBuffer());
  const savedPath = path.join(uploadDir, filename);
  await fs.writeFile(savedPath, content);
  const url = `/uploads/branding/${filename}`;
  if (kind === "favicon") {
    const icoPath = path.join(process.cwd(), "public", "favicon.ico");
    try {
      await fs.copyFile(savedPath, icoPath);
    } catch {}
  }
  return url;
}

export async function GET() {
  try {
    const s = await db.websiteSetting.findUnique({ where: { id: "singleton" } });
    let f: unknown = null;
    const footerClient = (db as unknown as Record<string, unknown>)["footerSetting"] as
      | { findUnique: (args: unknown) => Promise<any> }
      | undefined;
    if (footerClient?.findUnique) {
      f = await footerClient.findUnique({ where: { id: "singleton" } });
    }
    return NextResponse.json({
      website: s ?? { id: "singleton", siteName: "Gamingqu" },
      footer: f ?? { id: "singleton" },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const form = await req.formData();
    const siteName = (form.get("siteName") as string | null) ?? "";
    const tagline = (form.get("tagline") as string | null) ?? "";
    const contactEmail = (form.get("contactEmail") as string | null) ?? "";
    const contactPhone = (form.get("contactPhone") as string | null) ?? "";
    const logoFile = form.get("logo") as File | null;
    const faviconFile = form.get("favicon") as File | null;
    const logoUrl = await saveBrandFile(logoFile, "logo");
    const faviconUrl = await saveBrandFile(faviconFile, "favicon");
    const updated = await db.websiteSetting.upsert({
      where: { id: "singleton" },
      update: {
        siteName: siteName || undefined,
        tagline: tagline || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        logoUrl: logoUrl ?? undefined,
        faviconUrl: faviconUrl ?? undefined,
      },
      create: {
        id: "singleton",
        siteName: siteName || "Gamingqu",
        tagline: tagline || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        logoUrl: logoUrl ?? undefined,
        faviconUrl: faviconUrl ?? undefined,
      },
    });
    const disclaimer = ((form.get("footerDisclaimer") as string | null) ?? "").trim();
    const copyright = ((form.get("footerCopyright") as string | null) ?? "").trim();
    const legalAddress = ((form.get("footerLegalAddress") as string | null) ?? "").trim();
    const regNumber = ((form.get("footerRegNumber") as string | null) ?? "").trim();
    const badgeMastercardUrl = ((form.get("badgeMastercardUrl") as string | null) ?? "").trim();
    const badgeVisaUrl = ((form.get("badgeVisaUrl") as string | null) ?? "").trim();
    const badgePciUrl = ((form.get("badgePciUrl") as string | null) ?? "").trim();
    const footerClient2 = (db as unknown as Record<string, unknown>)["footerSetting"] as
      | { upsert: (args: unknown) => Promise<any> }
      | undefined;
    if (footerClient2?.upsert) {
      const valOrNull = (v: string) => (v.length > 0 ? v : null);
      await footerClient2.upsert({
        where: { id: "singleton" },
        update: {
          disclaimer: valOrNull(disclaimer),
          copyright: valOrNull(copyright),
          legalAddress: valOrNull(legalAddress),
          regNumber: valOrNull(regNumber),
          badgeMastercardUrl: valOrNull(badgeMastercardUrl),
          badgeVisaUrl: valOrNull(badgeVisaUrl),
          badgePciUrl: valOrNull(badgePciUrl),
          isActive: true,
        },
        create: {
          id: "singleton",
          disclaimer: valOrNull(disclaimer),
          copyright: valOrNull(copyright),
          legalAddress: valOrNull(legalAddress),
          regNumber: valOrNull(regNumber),
          badgeMastercardUrl: valOrNull(badgeMastercardUrl),
          badgeVisaUrl: valOrNull(badgeVisaUrl),
          badgePciUrl: valOrNull(badgePciUrl),
          isActive: true,
        },
      });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return NextResponse.json({ ok: true, data: updated, toast: "saved" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
