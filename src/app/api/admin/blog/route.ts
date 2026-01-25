import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";
import { sanitizeHtml, sanitizePlain } from "@/lib/sanitize";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const slug = formData.get("slug") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and Slug are required" }, { status: 400 });
    }

    const post = await db.post.create({
      data: {
        title: sanitizePlain(title),
        slug: sanitizePlain(slug),
        content: sanitizeHtml(content),
        excerpt: sanitizePlain(excerpt),
        imageUrl,
        isPublished,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const content = formData.get("content") as string;
      const excerpt = formData.get("excerpt") as string;
      const slug = formData.get("slug") as string;
      const imageUrl = formData.get("imageUrl") as string;
      const isPublished = formData.get("isPublished") === "true";
  
      if (!id || !title || !slug) {
        return NextResponse.json({ error: "ID, Title and Slug are required" }, { status: 400 });
      }
  
      const post = await db.post.update({
        where: { id },
        data: {
          title: sanitizePlain(title),
          slug: sanitizePlain(slug),
          content: sanitizeHtml(content),
          excerpt: sanitizePlain(excerpt),
          imageUrl,
          isPublished,
        },
      });
  
      return NextResponse.json(post);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await db.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
