import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { promises as fs } from "fs";
import { getFooterSettings } from "@/lib/settings";

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

async function saveFooterFile(file: File | null, kind: string): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "footer");
  await fs.mkdir(uploadDir, { recursive: true });
  const name = file.name || `${kind}.bin`;
  const ext = path.extname(name) || ".bin";
  const filename = `footer-${kind}-${Date.now()}${ext}`;
  const content = Buffer.from(await file.arrayBuffer());
  const savedPath = path.join(uploadDir, filename);
  await fs.writeFile(savedPath, content);
  return `/uploads/footer/${filename}`;
}

export async function GET() {
  try {
    const s = await db.websiteSetting.findUnique({ where: { id: "singleton" } });
    const f = await getFooterSettings();
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
    const footerFieldNames = [
      "footerDisclaimer",
      "footerShortDescription",
      "footerCopyright",
      "footerLegalAddress",
      "footerRegNumber",
      "smTelegramUrl",
      "smYoutubeUrl",
      "smDiscordUrl",
      "smFacebookUrl",
      "badgeMastercardUrl",
      "badgeVisaUrl",
      "badgePciUrl",
      "navHomeTitle",
      "navHomeUrl",
      "navAboutTitle",
      "navAboutUrl",
      "navFaqTitle",
      "navFaqUrl",
      "navBoosterTitle",
      "navBoosterUrl",
      "legal1Title",
      "legal1Url",
      "legal2Title",
      "legal2Url",
      "legal3Title",
      "legal3Url",
      "legal4Title",
      "legal4Url",
      "pmVisa",
      "pmMastercard",
      "pmGpay",
      "pmApplePay",
      "pmPaypal",
      "pmStripe",
    ];
    const shouldSaveFooter = footerFieldNames.some((name) => form.has(name));
    if (shouldSaveFooter) {
      const disclaimer = ((form.get("footerDisclaimer") as string | null) ?? "").trim();
      const shortDescription = ((form.get("footerShortDescription") as string | null) ?? "").trim();
      const copyright = ((form.get("footerCopyright") as string | null) ?? "").trim();
      const legalAddress = ((form.get("footerLegalAddress") as string | null) ?? "").trim();
      const regNumber = ((form.get("footerRegNumber") as string | null) ?? "").trim();
      const smTelegramUrl = ((form.get("smTelegramUrl") as string | null) ?? "").trim();
      const smYoutubeUrl = ((form.get("smYoutubeUrl") as string | null) ?? "").trim();
      const smDiscordUrl = ((form.get("smDiscordUrl") as string | null) ?? "").trim();
      const smFacebookUrl = ((form.get("smFacebookUrl") as string | null) ?? "").trim();
      const badgeMastercardUrl = ((form.get("badgeMastercardUrl") as string | null) ?? "").trim();
      const badgeVisaUrl = ((form.get("badgeVisaUrl") as string | null) ?? "").trim();
      const badgePciUrl = ((form.get("badgePciUrl") as string | null) ?? "").trim();
      const navHomeTitle = ((form.get("navHomeTitle") as string | null) ?? "").trim();
      const navHomeUrl = ((form.get("navHomeUrl") as string | null) ?? "").trim();
      const navAboutTitle = ((form.get("navAboutTitle") as string | null) ?? "").trim();
      const navAboutUrl = ((form.get("navAboutUrl") as string | null) ?? "").trim();
      const navFaqTitle = ((form.get("navFaqTitle") as string | null) ?? "").trim();
      const navFaqUrl = ((form.get("navFaqUrl") as string | null) ?? "").trim();
      const navBoosterTitle = ((form.get("navBoosterTitle") as string | null) ?? "").trim();
      const navBoosterUrl = ((form.get("navBoosterUrl") as string | null) ?? "").trim();
      const legal1Title = ((form.get("legal1Title") as string | null) ?? "").trim();
      const legal1Url = ((form.get("legal1Url") as string | null) ?? "").trim();
      const legal2Title = ((form.get("legal2Title") as string | null) ?? "").trim();
      const legal2Url = ((form.get("legal2Url") as string | null) ?? "").trim();
      const legal3Title = ((form.get("legal3Title") as string | null) ?? "").trim();
      const legal3Url = ((form.get("legal3Url") as string | null) ?? "").trim();
      const legal4Title = ((form.get("legal4Title") as string | null) ?? "").trim();
      const legal4Url = ((form.get("legal4Url") as string | null) ?? "").trim();
      const pmVisaFile = form.get("pmVisa") as File | null;
      const pmMastercardFile = form.get("pmMastercard") as File | null;
      const pmGpayFile = form.get("pmGpay") as File | null;
      const pmApplePayFile = form.get("pmApplePay") as File | null;
      const pmPaypalFile = form.get("pmPaypal") as File | null;
      const pmStripeFile = form.get("pmStripe") as File | null;
      const pmVisaUrl = await saveFooterFile(pmVisaFile, "pm-visa");
      const pmMastercardUrl = await saveFooterFile(pmMastercardFile, "pm-mastercard");
      const pmGpayUrl = await saveFooterFile(pmGpayFile, "pm-gpay");
      const pmApplePayUrl = await saveFooterFile(pmApplePayFile, "pm-applepay");
      const pmPaypalUrl = await saveFooterFile(pmPaypalFile, "pm-paypal");
      const pmStripeUrl = await saveFooterFile(pmStripeFile, "pm-stripe");
      const valOrNull = (v: string) => (v.length > 0 ? v : null);
      await db.footerSetting.upsert({
        where: { id: "singleton" },
        update: {
          disclaimer: valOrNull(disclaimer),
          shortDescription: valOrNull(shortDescription),
          copyright: valOrNull(copyright),
          legalAddress: valOrNull(legalAddress),
          regNumber: valOrNull(regNumber),
          smTelegramUrl: valOrNull(smTelegramUrl),
          smYoutubeUrl: valOrNull(smYoutubeUrl),
          smDiscordUrl: valOrNull(smDiscordUrl),
          smFacebookUrl: valOrNull(smFacebookUrl),
          badgeMastercardUrl: valOrNull(badgeMastercardUrl),
          badgeVisaUrl: valOrNull(badgeVisaUrl),
          badgePciUrl: valOrNull(badgePciUrl),
          navHomeTitle: valOrNull(navHomeTitle),
          navHomeUrl: valOrNull(navHomeUrl),
          navAboutTitle: valOrNull(navAboutTitle),
          navAboutUrl: valOrNull(navAboutUrl),
          navFaqTitle: valOrNull(navFaqTitle),
          navFaqUrl: valOrNull(navFaqUrl),
          navBoosterTitle: valOrNull(navBoosterTitle),
          navBoosterUrl: valOrNull(navBoosterUrl),
          legal1Title: valOrNull(legal1Title),
          legal1Url: valOrNull(legal1Url),
          legal2Title: valOrNull(legal2Title),
          legal2Url: valOrNull(legal2Url),
          legal3Title: valOrNull(legal3Title),
          legal3Url: valOrNull(legal3Url),
          legal4Title: valOrNull(legal4Title),
          legal4Url: valOrNull(legal4Url),
          pmVisaUrl: pmVisaUrl ?? undefined,
          pmMastercardUrl: pmMastercardUrl ?? undefined,
          pmGpayUrl: pmGpayUrl ?? undefined,
          pmApplePayUrl: pmApplePayUrl ?? undefined,
          pmPaypalUrl: pmPaypalUrl ?? undefined,
          pmStripeUrl: pmStripeUrl ?? undefined,
          isActive: true,
        },
        create: {
          id: "singleton",
          disclaimer: valOrNull(disclaimer),
          shortDescription: valOrNull(shortDescription),
          copyright: valOrNull(copyright),
          legalAddress: valOrNull(legalAddress),
          regNumber: valOrNull(regNumber),
          smTelegramUrl: valOrNull(smTelegramUrl),
          smYoutubeUrl: valOrNull(smYoutubeUrl),
          smDiscordUrl: valOrNull(smDiscordUrl),
          smFacebookUrl: valOrNull(smFacebookUrl),
          badgeMastercardUrl: valOrNull(badgeMastercardUrl),
          badgeVisaUrl: valOrNull(badgeVisaUrl),
          badgePciUrl: valOrNull(badgePciUrl),
          navHomeTitle: valOrNull(navHomeTitle),
          navHomeUrl: valOrNull(navHomeUrl),
          navAboutTitle: valOrNull(navAboutTitle),
          navAboutUrl: valOrNull(navAboutUrl),
          navFaqTitle: valOrNull(navFaqTitle),
          navFaqUrl: valOrNull(navFaqUrl),
          navBoosterTitle: valOrNull(navBoosterTitle),
          navBoosterUrl: valOrNull(navBoosterUrl),
          legal1Title: valOrNull(legal1Title),
          legal1Url: valOrNull(legal1Url),
          legal2Title: valOrNull(legal2Title),
          legal2Url: valOrNull(legal2Url),
          legal3Title: valOrNull(legal3Title),
          legal3Url: valOrNull(legal3Url),
          legal4Title: valOrNull(legal4Title),
          legal4Url: valOrNull(legal4Url),
          pmVisaUrl: pmVisaUrl ?? undefined,
          pmMastercardUrl: pmMastercardUrl ?? undefined,
          pmGpayUrl: pmGpayUrl ?? undefined,
          pmApplePayUrl: pmApplePayUrl ?? undefined,
          pmPaypalUrl: pmPaypalUrl ?? undefined,
          pmStripeUrl: pmStripeUrl ?? undefined,
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
