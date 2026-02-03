import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
    try {
        // Ambil semua service yang aktif
        const allServices = await db.service.findMany({
            where: { isActive: true },
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

        // Shuffle array dan ambil 5 random
        const shuffled = allServices.sort(() => Math.random() - 0.5);
        const randomServices = shuffled.slice(0, 5);

        return NextResponse.json({ services: randomServices });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
