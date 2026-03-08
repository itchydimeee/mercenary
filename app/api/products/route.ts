import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 50;

  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
      include: { variants: { orderBy: { size: "asc" } } },
    });

    return NextResponse.json(
      products.map((p) => ({ ...p, price: Number(p.price) }))
    );
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}
