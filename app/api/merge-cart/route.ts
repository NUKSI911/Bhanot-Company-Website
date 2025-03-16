// app/api/merge-carts/route.ts
import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionCartId } = await request.json();
    
    const sessionCart = await prisma.cart.findFirst({
      where: { sessionCartId },
    });

    if (sessionCart) {
      await prisma.$transaction([
        prisma.cart.deleteMany({
          where: { userId },
        }),
        prisma.cart.update({
          where: { id: sessionCart.id },
          data: { userId },
        }),
      ]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to merge carts" },
      { status: 500 }
    );
  }
}