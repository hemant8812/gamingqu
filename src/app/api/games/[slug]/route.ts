import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const game = await db.game.findUnique({
            where: { slug, isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                imageUrl: true,
                iconUrl: true,
                categories: {
                    where: { isActive: true },
                    orderBy: { name: "asc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        services: {
                            where: { isActive: true },
                            orderBy: { createdAt: "desc" },
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true,
                                imageUrl: true,
                                price: true,
                                isHotOffer: true,
                                features: true,
                            },
                        },
                    },
                },
                services: {
                    where: { isActive: true, categoryId: null },
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        imageUrl: true,
                        price: true,
                        isHotOffer: true,
                        features: true,
                    },
                },
            },
        });

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        return NextResponse.json(game);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
