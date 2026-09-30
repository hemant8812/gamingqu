import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { canAccessAdminSection } from "@/lib/adminAccess";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") || !(await canAccessAdminSection("services-data"))) {
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
      inputMeta: it.inputMeta as unknown as { kind: "text" | "number"; min?: number; max?: number; required?: boolean } | undefined,
    }));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") || !(await canAccessAdminSection("services-data"))) {
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
      range?: unknown;
      inputMeta?: { kind: "text" | "number"; min?: number; max?: number; required?: boolean };
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
    let rangeResolved: Prisma.InputJsonValue | undefined = undefined;
    if (range && typeof range === "object") {
      const r = range as { min?: unknown; max?: unknown; step?: unknown; dual?: unknown; items?: unknown };
      const itemsRaw = Array.isArray(r.items) ? r.items : undefined;
      const items = itemsRaw
        ? itemsRaw
            .filter((it): it is { min?: unknown; max?: unknown; price?: unknown } => !!it && typeof it === "object")
            .map((it) => {
              const mn = Number((it as { min?: unknown }).min);
              const mx = Number((it as { max?: unknown }).max);
              const pr = Number((it as { price?: unknown }).price);
              if (!Number.isFinite(mn) || !Number.isFinite(mx) || !Number.isFinite(pr)) return null;
              return { min: mn, max: mx, price: pr };
            })
            .filter((v): v is { min: number; max: number; price: number } => v != null)
        : undefined;
      const minFromItems = items && items.length > 0 ? items.reduce((acc, it) => Math.min(acc, it.min), items[0].min) : undefined;
      const maxFromItems = items && items.length > 0 ? items.reduce((acc, it) => Math.max(acc, it.max), items[0].max) : undefined;
      const minVal = Number.isFinite(Number(r.min)) ? Number(r.min) : (minFromItems ?? 0);
      const maxVal = Number.isFinite(Number(r.max)) ? Number(r.max) : (maxFromItems ?? 0);
      const stepCandidate = r.step != null ? Number(r.step) : 1;
      const stepVal = Number.isFinite(stepCandidate) ? stepCandidate : 1;
      const dualVal = inputType === "range" && (displayResolved === "dual" || Boolean(r.dual)) ? true : false;
      rangeResolved = { min: minVal, max: maxVal, step: stepVal, dual: dualVal, ...(items ? { items } : {}) } as Prisma.InputJsonValue;
    }
    const inputMetaResolved =
      inputMeta && typeof inputMeta === "object"
        ? {
            kind: inputMeta.kind === "number" ? "number" : "text",
            min: Number.isFinite(inputMeta.min) ? Number(inputMeta.min) : undefined,
            max: Number.isFinite(inputMeta.max) ? Number(inputMeta.max) : undefined,
            required: !!inputMeta.required,
          }
        : undefined;
    if ((inputMetaResolved?.required ?? false) && (inputType === "select" || inputType === "radio" || inputType === "checkbox")) {
      const hasOpts = Array.isArray(optionsResolved) && optionsResolved.length > 0;
      if (!hasOpts) {
        return NextResponse.json({ error: "Field bertipe opsi yang wajib memerlukan daftar options" }, { status: 400 });
      }
    }

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
      serviceName: (created as unknown as { service?: { name?: string } }).service?.name ?? "",
      title: created.title,
      fieldName: created.fieldName,
      inputType: created.inputType,
      displayType: created.displayType ?? undefined,
      priceType: created.priceType,
      price: Number.parseFloat(created.price.toString()),
      sortOrder: created.sortOrder,
      options: Array.isArray(created.options as unknown) ? (created.options as unknown as Array<{ label: string; price: number }>) : undefined,
      range: created.range as unknown as { min: number; max: number; step?: number; dual?: boolean } | undefined,
      inputMeta: created.inputMeta as unknown as { kind: "text" | "number"; min?: number; max?: number; required?: boolean } | undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") || !(await canAccessAdminSection("services-data"))) {
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
      range?: unknown;
      inputMeta?: { kind: "text" | "number"; min?: number; max?: number; required?: boolean };
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
    let rangeResolved: Prisma.InputJsonValue | undefined = undefined;
    if (range && typeof range === "object") {
      const r = range as { min?: unknown; max?: unknown; step?: unknown; dual?: unknown; items?: unknown };
      const itemsRaw = Array.isArray(r.items) ? r.items : undefined;
      const items = itemsRaw
        ? itemsRaw
            .filter((it): it is { min?: unknown; max?: unknown; price?: unknown } => !!it && typeof it === "object")
            .map((it) => {
              const mn = Number((it as { min?: unknown }).min);
              const mx = Number((it as { max?: unknown }).max);
              const pr = Number((it as { price?: unknown }).price);
              if (!Number.isFinite(mn) || !Number.isFinite(mx) || !Number.isFinite(pr)) return null;
              return { min: mn, max: mx, price: pr };
            })
            .filter((v): v is { min: number; max: number; price: number } => v != null)
        : undefined;
      const minFromItems = items && items.length > 0 ? items.reduce((acc, it) => Math.min(acc, it.min), items[0].min) : undefined;
      const maxFromItems = items && items.length > 0 ? items.reduce((acc, it) => Math.max(acc, it.max), items[0].max) : undefined;
      const minVal = Number.isFinite(Number(r.min)) ? Number(r.min) : (minFromItems ?? 0);
      const maxVal = Number.isFinite(Number(r.max)) ? Number(r.max) : (maxFromItems ?? 0);
      const stepCandidate = r.step != null ? Number(r.step) : 1;
      const stepVal = Number.isFinite(stepCandidate) ? stepCandidate : 1;
      const dualVal = inputType === "range" && (displayResolved === "dual" || Boolean(r.dual)) ? true : false;
      rangeResolved = { min: minVal, max: maxVal, step: stepVal, dual: dualVal, ...(items ? { items } : {}) } as Prisma.InputJsonValue;
    }
    const inputMetaResolved =
      inputMeta && typeof inputMeta === "object"
        ? {
            kind: inputMeta.kind === "number" ? "number" : "text",
            min: Number.isFinite(inputMeta.min) ? Number(inputMeta.min) : undefined,
            max: Number.isFinite(inputMeta.max) ? Number(inputMeta.max) : undefined,
            required: !!inputMeta.required,
          }
        : undefined;
    if ((inputMetaResolved?.required ?? false) && (inputType === "select" || inputType === "radio" || inputType === "checkbox")) {
      const hasOpts = Array.isArray(optionsResolved) && optionsResolved.length > 0;
      if (!hasOpts) {
        return NextResponse.json({ error: "Field bertipe opsi yang wajib memerlukan daftar options" }, { status: 400 });
      }
    }

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
      serviceName: (updated as unknown as { service?: { name?: string } }).service?.name ?? "",
      title: updated.title,
      fieldName: updated.fieldName,
      inputType: updated.inputType,
      displayType: updated.displayType ?? undefined,
      priceType: updated.priceType,
      price: Number.parseFloat(updated.price.toString()),
      sortOrder: updated.sortOrder,
      options: Array.isArray(updated.options as unknown) ? (updated.options as unknown as Array<{ label: string; price: number }>) : undefined,
      range: updated.range as unknown as { min: number; max: number; step?: number; dual?: boolean } | undefined,
      inputMeta: updated.inputMeta as unknown as { kind: "text" | "number"; min?: number; max?: number; required?: boolean } | undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") || !(await canAccessAdminSection("services-data"))) {
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
