import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// STNU / DPDS Scheduling stub
// Assigns tasks priorities based on:
//   1) Urgency: time-remaining vs. estimated duration
//   2) Complexity adjusted by biopsychosocial state (sleep quality, stress)
function computeAdaptivePriority(
    task: { deadline: Date; estimatedDuration: number; complexity: number },
    health: { sleepDuration: number; sleepQuality: number; stressLevel: number } | null
): number {
    const now = Date.now();
    const hoursLeft = (task.deadline.getTime() - now) / (1000 * 60 * 60);
    const urgency = Math.max(0, 100 - (hoursLeft / (task.estimatedDuration / 60)) * 10);

    // Biopsychosocial modifier: poor sleep/high stress → down-shift complexity score
    let bioMod = 1.0;
    if (health) {
        const sleepOk = health.sleepDuration >= 6 && health.sleepDuration <= 8;
        const stressLow = health.stressLevel <= 5;
        if (!sleepOk) bioMod -= 0.2;
        if (!stressLow) bioMod -= 0.15;
    }

    const adjusted = task.complexity * bioMod;
    return Math.round(urgency * 0.6 + adjusted * 4);
}

export async function GET() {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            tasks: { where: { completed: false }, orderBy: { deadline: "asc" } },
            healthMetrics: { orderBy: { date: "desc" }, take: 1 },
        },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const latestHealth = user.healthMetrics[0] ?? null;

    const scheduledTasks = user.tasks.map(task => ({
        ...task,
        priority: computeAdaptivePriority(task, latestHealth),
    })).sort((a, b) => b.priority - a.priority);

    // Energy level 0-100 based on biopsychosocial state
    let energyLevel = 70;
    if (latestHealth) {
        const sleepScore = Math.min(latestHealth.sleepDuration / 8, 1) * 40;
        const qualityScore = (latestHealth.sleepQuality / 10) * 30;
        const stressScore = ((10 - latestHealth.stressLevel) / 10) * 30;
        energyLevel = Math.round(sleepScore + qualityScore + stressScore);
    }

    return NextResponse.json({
        user: { name: user.name, role: user.role, chronotype: user.chronotype },
        scheduledTasks,
        latestHealth,
        energyLevel,
        totalTasks: user.tasks.length,
        completedTasks: await prisma.task.count({ where: { userId: user.id, completed: true } }),
    });
}
