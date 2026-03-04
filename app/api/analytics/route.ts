import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            userProfile: true,
            tasks: {
                include: { studySessions: true }
            },
            healthMetrics: {
                orderBy: { date: 'desc' },
                take: 14
            }
        }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Radar Data: Proficiency by Subject
    let subjectScores: Record<string, { total: number, count: number }> = {};

    user.tasks.forEach(task => {
        const subject = task.title.split(":")[0] || "General"; // Assume title format "Subject: Task"
        task.studySessions.forEach(session => {
            if (session.retentionScore) {
                if (!subjectScores[subject]) subjectScores[subject] = { total: 0, count: 0 };
                subjectScores[subject].total += session.retentionScore;
                subjectScores[subject].count += 1;
            }
        });
    });

    const radarData = Object.entries(subjectScores).map(([subject, data]) => ({
        subject,
        score: Math.round(data.total / data.count),
        fullMark: 100
    }));

    // Fallback if no data
    const finalRadarData = radarData.length > 0 ? radarData : [
        { subject: "Math", score: 0, fullMark: 100 },
        { subject: "Science", score: 0, fullMark: 100 },
        { subject: "Tech", score: 0, fullMark: 100 }
    ];

    // 2. Scatter Data: Stress vs Study Hours vs Retention
    const scatterData = user.tasks.flatMap(task =>
        task.studySessions.map(session => {
            // Find closest health metric in time (simplified for now)
            const health = user.healthMetrics[0];
            return {
                x: Math.round(session.actualDuration / 60 * 10) / 10, // hours
                y: health?.stressLevel || 5,
                z: session.retentionScore || 50
            };
        })
    );

    // 3. Gantt Data (Goal Phases)
    let userGoals = [];
    try {
        if (user.userProfile?.goals) {
            let parsed = JSON.parse(user.userProfile.goals);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            userGoals = Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) { }

    const primaryGoal = userGoals[0] || "General Learning";

    // Simplified Gantt mapping from our Roadmap logic
    const isPilot = primaryGoal.toLowerCase().includes("pilot") || primaryGoal.toLowerCase().includes("aviation");
    const ganttData = isPilot ? [
        { name: "Month 1", plan_start: 0, plan_dur: 30, label: "Ground School & Medical" },
        { name: "Month 2", plan_start: 30, plan_dur: 30, label: "PPL Training" },
        { name: "Month 3", plan_start: 60, plan_dur: 30, label: "Instrument Rating" },
        { name: "Sprint A", plan_start: 0, plan_dur: 15, label: "FAA Exams" },
        { name: "Sprint B", plan_start: 15, plan_dur: 15, label: "Solo Flight" }
    ] : [
        { name: "Phase 1", plan_start: 0, plan_dur: 30, label: "Foundation" },
        { name: "Phase 2", plan_start: 30, plan_dur: 30, label: "Implementation" },
        { name: "Phase 3", plan_start: 60, plan_dur: 30, label: "Mastery" }
    ];

    // 4. Weekly Stats
    const weeklyData = [
        { day: "Mon", hours: 0, retention: 0 },
        { day: "Tue", hours: 0, retention: 0 },
        { day: "Wed", hours: 0, retention: 0 },
        { day: "Thu", hours: 0, retention: 0 },
        { day: "Fri", hours: 0, retention: 0 },
        { day: "Sat", hours: 0, retention: 0 },
        { day: "Sun", hours: 0, retention: 0 },
    ];
    // Populate with real data if available...

    return NextResponse.json({
        radarData: finalRadarData,
        scatterData: scatterData.slice(-20), // Last 20 sessions
        ganttData,
        weeklyData,
        primaryGoal
    });
}
