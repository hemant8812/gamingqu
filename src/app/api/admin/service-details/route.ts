import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const list = await db.serviceDetail.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        serviceId: true,
        title: true,
        fieldName: true,
        inputType: true,
        displayType: true,
        priceType: true,
        price: true,
        sortOrder: true,
        options: true,
        range: true,
        inputMeta: true,
        service: { select: { name: true } },
      },
      take: 500,
    });
    const data = list.map((it) => ({
      id: it.id,
      serviceId: it.serviceId,
      serviceName: it.service?.name ?? "",
      title: it.title,
      fieldName: it.fieldName,
      inputType: it.inputType,
      displayType: it.displayType ?? undefined,
      priceType: it.priceType,
      price: Number.parseFloat(it.price.toString()),
      sortOrder: it.sortOrder,
      options: Array.isArray(it.options as unknown) ? (it.options as unknown as Array<{ label: string; price: number }>) : undefined,
      range: it.range as unknown as { min: number; max: number; step?: number; dual?: boolean } | undefined,
      inputMeta: it.inputMeta as unknown as { kind: "text" | "number"; min?: number; max?: number } | undefined,
    }));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    const {
      serviceId,
      title,
      fieldName,
      inputType,
      displayType,
      priceType,
      price,
      sortOrder,
      options,
      range,
      inputMeta,
    } = body as {
      serviceId: number;
      title?: string;
      fieldName?: string;
      inputType?: "select" | "radio" | "range" | "checkbox" | "input";
      displayType?: "number" | "text" | "dual" | "single";
      priceType?: "fixed" | "percent";
      price?: number;
      sortOrder?: number;
      options?: Array<{ label: string; price: number }>;
      range?: { min: number; max: number; step?: number; dual?: boolean };
      inputMeta?: { kind: "text" | "number"; min?: number; max?: number };
    };

    if (!Number.isFinite(serviceId)) {
      return NextResponse.json({ error: "serviceId tidak valid" }, { status: 400 });
    }
    const svc = await db.service.findUnique({ where: { id: serviceId }, select: { id: true } });
    if (!svc) {
      return NextResponse.json({ error: "Service tidak ditemukan" }, { status: 404 });
    }
    if (!title || !inputType) {
      return NextResponse.json({ error: "Title dan inputType diperlukan" }, { status: 400 });
    }
    const allowedInput = ["select", "radio", "range", "checkbox", "input"] as const;
    if (!allowedInput.includes(inputType)) {
      return NextResponse.json({ error: "inputType tidak valid" }, { status: 400 });
    }
    const allowedPrice = ["fixed", "percent"] as const;
    const priceTypeResolved = allowedPrice.includes(priceType ?? "fixed") ? (priceType ?? "fixed") : "fixed";
    let displayResolved: "number" | "text" | "dual" | "single" | null = null;
    if (displayType) {
      if (inputType === "input" && (displayType === "number" || displayType === "text")) {
        displayResolved = displayType;
      } else if (inputType === "range" && (displayType === "dual" || displayType === "single")) {
        displayResolved = displayType;
      }
    }
    const numericPrice = Number.isFinite(price) ? (price as number) : 0;
    const sortResolved = Number.isFinite(sortOrder) ? (sortOrder as number) : 0;
    const optionsResolved = Array.isArray(options)
      ? options
          .filter((o) => !!o && typeof o.label === "string" && Number.isFinite(o.price))
          .map((o) => ({ label: o.label, price: Number(o.price) }))
      : undefined;
    const rangeResolved = range && typeof range === "object"
      ? {
          min: Number.isFinite(range.min) ? Number(range.min) : 0,
          max: Number.isFinite(range.max) ? Number(range.max) : 0,
          step: Number.isFinite(range.step ?? 1) ? Number(range.step ?? 1) : 1,
          dual: !!range.dual,
        }
      : undefined;
    const inputMetaResolved =
      inputMeta && typeof inputMeta === "object"
        ? {
            kind: inputMeta.kind === "number" ? "number" : "text",
            min: Number.isFinite(inputMeta.min) ? Number(inputMeta.min) : undefined,
            max: Number.isFinite(inputMeta.max) ? Number(inputMeta.max) : undefined,
          }
        : undefined;

    const created = await db.serviceDetail.create({
      data: {
        serviceId,
        title,
        fieldName: fieldName ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        inputType,
        displayType: displayResolved,
        priceType: priceTypeResolved,
        price: numericPrice,
        sortOrder: sortResolved,
        options: optionsResolved,
        range: rangeResolved,
        inputMeta: inputMetaResolved,
      },
      select: {
        id: true,
        serviceId: true,
        title: true,
        fieldName: true,
        inputType: true,
        displayType: true,
        priceType: true,
        price: true,
        sortOrder: true,
        options: true,
        range: true,
        inputMeta: true,
        service: { select: { name: true } },
      },
    });

    return NextResponse.json({
      id: created.id,
      serviceId: created.serviceId,
      serviceName: created.service?.name ?? "",
      title: created.title,
      fieldName: created.fieldName,
      inputType: created.inputType,
      displayType: created.displayType ?? undefined,
      priceType: created.priceType,
      price: Number.parseFloat(created.price.toString()),
      sortOrder: created.sortOrder,
      options: Array.isArray(created.options as unknown) ? (created.options as unknown as Array<{ label: string; price: number }>) : undefined,
      range: created.range as unknown as { min: number; max: number; step?: number; dual?: boolean } | undefined,
      inputMeta: created.inputMeta as unknown as { kind: "text" | "number"; min?: number; max?: number } | undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    const {
      id,
      serviceId,
      title,
      fieldName,
      inputType,
      displayType,
      priceType,
      price,
      sortOrder,
      options,
      range,
      inputMeta,
    } = body as {
      id: number;
      serviceId: number;
      title?: string;
      fieldName?: string;
      inputType?: "select" | "radio" | "range" | "checkbox" | "input";
      displayType?: "number" | "text" | "dual" | "single";
      priceType?: "fixed" | "percent";
      price?: number;
      sortOrder?: number;
      options?: Array<{ label: string; price: number }>;
      range?: { min: number; max: number; step?: number; dual?: boolean };
      inputMeta?: { kind: "text" | "number"; min?: number; max?: number };
    };

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id diperlukan" }, { status: 400 });
    }
    const existing = await db.serviceDetail.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Detail tidak ditemukan" }, { status: 404 });
    }
    if (!Number.isFinite(serviceId)) {
      return NextResponse.json({ error: "serviceId tidak valid" }, { status: 400 });
    }
    const svc = await db.service.findUnique({ where: { id: serviceId }, select: { id: true } });
    if (!svc) {
      return NextResponse.json({ error: "Service tidak ditemukan" }, { status: 404 });
    }
    if (!title || !inputType) {
      return NextResponse.json({ error: "Title dan inputType diperlukan" }, { status: 400 });
    }
    const allowedInput = ["select", "radio", "range", "checkbox", "input"] as const;
    if (!allowedInput.includes(inputType)) {
      return NextResponse.json({ error: "inputType tidak valid" }, { status: 400 });
    }
    const allowedPrice = ["fixed", "percent"] as const;
    const priceTypeResolved = allowedPrice.includes(priceType ?? "fixed") ? (priceType ?? "fixed") : "fixed";
    let displayResolved: "number" | "text" | "dual" | "single" | null = null;
    if (displayType) {
      if (inputType === "input" && (displayType === "number" || displayType === "text")) {
        displayResolved = displayType;
      } else if (inputType === "range" && (displayType === "dual" || displayType === "single")) {
        displayResolved = displayType;
      }
    }
    const numericPrice = Number.isFinite(price) ? (price as number) : 0;
    const sortResolved = Number.isFinite(sortOrder) ? (sortOrder as number) : 0;
    const optionsResolved = Array.isArray(options)
      ? options
          .filter((o) => !!o && typeof o.label === "string" && Number.isFinite(o.price))
          .map((o) => ({ label: o.label, price: Number(o.price) }))
      : undefined;
    const rangeResolved = range && typeof range === "object"
      ? {
          min: Number.isFinite(range.min) ? Number(range.min) : 0,
          max: Number.isFinite(range.max) ? Number(range.max) : 0,
          step: Number.isFinite(range.step ?? 1) ? Number(range.step ?? 1) : 1,
          dual: !!range.dual,
        }
      : undefined;
    const inputMetaResolved =
      inputMeta && typeof inputMeta === "object"
        ? {
            kind: inputMeta.kind === "number" ? "number" : "text",
            min: Number.isFinite(inputMeta.min) ? Number(inputMeta.min) : undefined,
            max: Number.isFinite(inputMeta.max) ? Number(inputMeta.max) : undefined,
          }
        : undefined;

    const updated = await db.serviceDetail.update({
      where: { id },
      data: {
        serviceId,
        title,
        fieldName: fieldName ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        inputType,
        displayType: displayResolved,
        priceType: priceTypeResolved,
        price: numericPrice,
        sortOrder: sortResolved,
        options: optionsResolved,
        range: rangeResolved,
        inputMeta: inputMetaResolved,
      },
      select: {
        id: true,
        serviceId: true,
        title: true,
        fieldName: true,
        inputType: true,
        displayType: true,
        priceType: true,
        price: true,
        sortOrder: true,
        options: true,
        range: true,
        inputMeta: true,
        service: { select: { name: true } },
      },
    });

    return NextResponse.json({
      id: updated.id,
      serviceId: updated.serviceId,
      serviceName: updated.service?.name ?? "",
      title: updated.title,
      fieldName: updated.fieldName,
      inputType: updated.inputType,
      displayType: updated.displayType ?? undefined,
      priceType: updated.priceType,
      price: Number.parseFloat(updated.price.toString()),
      sortOrder: updated.sortOrder,
      options: Array.isArray(updated.options as unknown) ? (updated.options as unknown as Array<{ label: string; price: number }>) : undefined,
      range: updated.range as unknown as { min: number; max: number; step?: number; dual?: boolean } | undefined,
      inputMeta: updated.inputMeta as unknown as { kind: "text" | "number"; min?: number; max?: number } | undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await db.serviceDetail.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
