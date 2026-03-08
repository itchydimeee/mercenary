import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to view messages." },
      { status: 401 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
      include: { product: { select: { name: true } } },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error("[GET /api/messages]", err);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message, product_id } = body;

  // Basic validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format." },
      { status: 400 }
    );
  }

  // Require auth to send messages (Supabase handles session / Google OAuth)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to send a message." },
      { status: 401 }
    );
  }

  try {
    await prisma.message.create({
      data: {
        user_id: user.id,
        product_id: product_id ?? null,
        message,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/messages]", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
