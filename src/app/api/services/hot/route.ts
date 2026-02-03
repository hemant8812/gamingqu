import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
    try {
        const hot = await db.service.findMany({
            where: { isActive: true, isHotOffer: true },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                features: true,
                isHotOffer: true,
                game: { select: { slug: true, name: true } },
            },
        });
        let services = hot;
        if (hot.length < 5) {
            const remainder = 5 - hot.length;
            const total = await db.service.count({ where: { isActive: true, isHotOffer: false } });
            const skip = total > remainder ? Math.max(0, Math.floor(Math.random() * Math.max(1, total - remainder))) : 0;
            const fallback = await db.service.findMany({
                where: { isActive: true, isHotOffer: false },
                orderBy: { createdAt: "desc" },
                skip,
                take: remainder,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    imageUrl: true,
                    features: true,
                    isHotOffer: true,
                    game: { select: { slug: true, name: true } },
                },
            });
            services = [...hot, ...fallback];
        }
        return NextResponse.json({ services });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
