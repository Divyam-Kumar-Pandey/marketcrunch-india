import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
    try {
        const predictions = await prisma.prediction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 50, // Limit to most recent 50 predictions
        });

        return NextResponse.json({ success: true, data: predictions, error: null });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, data: null, error: error.message },
            { status: 500 }
        );
    }
}
