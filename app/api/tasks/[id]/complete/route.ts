import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const task = await prisma.task.findFirst({
        where: { id: params.id, userId: user.id },
    });
    if (!task) return NextResponse.json({ error: "Task not found or not yours" }, { status: 404 });

    const updated = await prisma.task.update({
        where: { id: params.id },
        data: { completed: true },
    });

    return NextResponse.json({ success: true, task: updated });
}
