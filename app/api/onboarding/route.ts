import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profile, health, personality } = body;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Upsert UserProfile
    await prisma.userProfile.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            subjects: JSON.stringify(profile.subjects ?? []),
            goals: JSON.stringify(profile.goals ?? []),
            learningStyle: profile.learningStyle ?? "Visual",
            resourcePrefs: profile.resourcePrefs ?? "Mixed",
            institution: profile.institution ?? null,
            gradeLevel: profile.gradeLevel ?? null,
        },
        update: {
            subjects: JSON.stringify(profile.subjects ?? []),
            goals: JSON.stringify(profile.goals ?? []),
            learningStyle: profile.learningStyle ?? "Visual",
            resourcePrefs: profile.resourcePrefs ?? "Mixed",
            institution: profile.institution ?? null,
            gradeLevel: profile.gradeLevel ?? null,
        },
    });

    // Upsert PersonalityProfile
    if (personality) {
        await prisma.personalityProfile.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                personalityType: personality.type,
                scores: JSON.stringify(personality.scores),
            },
            update: {
                personalityType: personality.type,
                scores: JSON.stringify(personality.scores),
            },
        });
    }

    // Create HealthMetric baseline
    if (health) {
        await prisma.healthMetric.create({
            data: {
                userId: user.id,
                sleepDuration: health.sleepDuration,
                sleepQuality: health.sleepQuality,
                stressLevel: health.stressLevel,
            },
        });
    }

    // Update user chronotype + mark onboarding complete
    await prisma.user.update({
        where: { id: user.id },
        data: {
            chronotype: profile.chronotype ?? "BEAR",
            onboardingDone: true,
        },
    });

    return NextResponse.json({ success: true });
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { userProfile: true, personalityProfile: true },
    });
    return NextResponse.json({
        onboardingDone: user?.onboardingDone ?? false,
        profile: user?.userProfile,
        personality: user?.personalityProfile,
    });
}
