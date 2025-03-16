// app/api/update-name/route.ts
import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, name } = await request.json();

        await prisma.user.update({
            where: { id: userId },
            data: { name },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to update name" },
            { status: 500 }
        );
    }
}