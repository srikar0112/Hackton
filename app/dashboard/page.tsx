"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import Link from "next/link";

type Task = {
    id: string; title: string; complexity: number;
    estimatedDuration: number; deadline: string;
    priority: number; description?: string; completed: boolean;
};
type DashboardData = {
    user: { name: string; role: string; chronotype: string };
    scheduledTasks: Task[];
    latestHealth: { sleepDuration: number; sleepQuality: number; stressLevel: number } | null;
    energyLevel: number;
    totalTasks: number;
    completedTasks: number;
};

const CHRONOTYPE_LABEL: Record<string, string> = {
    LION: "🦁 Early Riser (Peak: 6–10am)",
    BEAR: "🐻 Mid-day (Peak: 10am–2pm)",
    WOLF: "🐺 Night Owl (Peak: 6–10pm)",
    DOLPHIN: "🐬 Irregular — Flexible",
};

function EnergyMeter({ level }: { level: number }) {
    const color = level >= 70 ? "var(--success)" : level >= 40 ? "var(--warning)" : "var(--danger)";
    const label = level >= 70 ? "High Energy" : level >= 40 ? "Moderate" : "Low — Rest Advised";
    return (
        <div style={{ padding: "0.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Biopsychosocial Energy</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color }}>{level}% — {label}</span>
            </div>
            <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${level}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
            </div>
        </div>
    );
}

function ComplexityBadge({ n }: { n: number }) {
    const col = n >= 8 ? "#f87171" : n >= 5 ? "#fbbf24" : "#34d399";
    return <span style={{ padding: "0.2rem 0.55rem", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, background: col + "22", color: col, border: `1px solid ${col}44` }}>C{n}</span>;
}

function DeadlineBadge({ deadline }: { deadline: string }) {
    const [hoursLeft, setHoursLeft] = useState<number | null>(null);
    useEffect(() => {
        setHoursLeft((new Date(deadline).getTime() - Date.now()) / 3_600_000);
    }, [deadline]);
    if (hoursLeft === null) return <span style={{ fontSize: "0.8rem", color: "#8b8ba8", fontWeight: 600 }}>⏰ --</span>;
    const col = hoursLeft < 24 ? "#f87171" : hoursLeft < 72 ? "#fbbf24" : "#8b8ba8";
    const label = hoursLeft < 1 ? "< 1hr" : hoursLeft < 24 ? `${Math.round(hoursLeft)}h` : `${Math.round(hoursLeft / 24)}d`;
    return <span style={{ fontSize: "0.8rem", color: col, fontWeight: 600 }}>⏰ {label}</span>;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState<string | null>(null);
    const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
    const [personality, setPersonality] = useState<{ personalityType: string } | null>(null);
    const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
    const router = require("next/navigation").useRouter();

    const [greeting, setGreeting] = useState("Good day");
    const role = (session?.user as any)?.role ?? "STUDENT";
    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening");
    }, []);

    useEffect(() => {
        // Load dashboard data
        fetch("/api/schedule").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); setLoading(false); }).catch(() => setLoading(false));
        // Check onboarding status
        fetch("/api/onboarding").then(r => r.ok ? r.json() : null).then(d => {
            if (!d) return;
            setOnboardingDone(d.onboardingDone);
            setPersonality(d.personality);

            let goals: string[] = [];
            try {
                if (d.profile?.goals) {
                    goals = JSON.parse(d.profile.goals);
                }
            } catch (e) {
                // Ignore parse errors
            }

            if (goals.length > 0) {
                setPrimaryGoal(goals[0]);
            } else {
                // Goal-First Architecture: Redirect to blank state
                router.push("/goal");
            }
        }).catch(() => { });
    }, [router]);

    const handleComplete = async (taskId: string) => {
        setCompleting(taskId);
        const res = await fetch(`/api/tasks/${taskId}/complete`, { method: "PATCH" });
        if (res.ok) {
            setData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    scheduledTasks: prev.scheduledTasks.filter(t => t.id !== taskId),
                    completedTasks: prev.completedTasks + 1,
                    totalTasks: prev.totalTasks,
                };
            });
        }
        setCompleting(null);
    };

    return (
        <AppShell>
            <div style={{ maxWidth: 1100 }}>
                {/* Onboarding nudge */}
                {onboardingDone === false && (
                    <div style={{ padding: "1rem 1.25rem", borderRadius: 12, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.35)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                            <strong>👋 Welcome! Complete your profile to personalise your experience.</strong>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 2 }}>Takes ~3 minutes. Includes personality quiz and subject selection.</p>
                        </div>
                        <Link href="/onboarding" className="btn btn-primary" style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                            Start Onboarding →
                        </Link>
                    </div>
                )}

                {/* Personality banner */}
                {personality && (
                    <div style={{ padding: "0.75rem 1.25rem", borderRadius: 12, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>🧩</span>
                        <div>
                            <span style={{ fontWeight: 700, color: "var(--accent)" }}>{personality.personalityType} Learner</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: "0.5rem" }}>— Schedule and resources are tailored to your archetype</span>
                        </div>
                        <Link href="/onboarding" style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "none" }}>Retake quiz →</Link>
                    </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem" }}>
                        Good {greeting}, <span className="gradient-text">{session?.user?.name?.split(" ")[0] ?? "Scholar"}</span> 👋
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "1.05rem" }}>
                        Focus: <span style={{ color: "var(--primary)", fontWeight: 600 }}>{primaryGoal || "Loading your objective..."}</span>
                    </p>
                </div>

                {/* Stat Grid */}
                <div className="stat-grid">
                    <div className="stat-card">
                        <div className="stat-label">Active Tasks</div>
                        <div className="stat-value" style={{ color: "var(--primary)" }}>{data ? data.scheduledTasks.length : "—"}</div>
                        <div className="stat-change positive">↑ STNU-Optimized</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Completed</div>
                        <div className="stat-value" style={{ color: "var(--success)" }}>{data?.completedTasks ?? "—"}</div>
                        <div className="stat-change positive">Session milestone</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Sleep Quality</div>
                        <div className="stat-value" style={{ color: "var(--secondary)" }}>
                            {data?.latestHealth ? `${data.latestHealth.sleepQuality}/10` : "—"}
                        </div>
                        <div className="stat-change">{data?.latestHealth && data.latestHealth.sleepDuration >= 6 ? "✅ Optimal" : "⚠️ Below optimal"}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Stress Index</div>
                        <div className="stat-value" style={{ color: data?.latestHealth && data.latestHealth.stressLevel > 6 ? "var(--danger)" : "var(--success)" }}>
                            {data?.latestHealth ? `${data.latestHealth.stressLevel}/10` : "—"}
                        </div>
                        <div className={`stat-change ${data?.latestHealth && data.latestHealth.stressLevel > 6 ? "negative" : "positive"}`}>
                            {data?.latestHealth && data.latestHealth.stressLevel > 6 ? "↑ High — ease complexity" : "↓ Manageable"}
                        </div>
                    </div>
                </div>

                {/* Energy Meter */}
                <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <EnergyMeter level={data?.energyLevel ?? 70} />
                    {data?.energyLevel !== undefined && data.energyLevel < 50 && (
                        <div className="nudge nudge-prep" style={{ marginTop: "0.75rem" }}>
                            <span>💡</span>
                            <div>
                                <strong>Preparatory Nudge:</strong> Low energy detected. Schedule complexity ≤ 5 tasks first and defer deep work until after rest.
                            </div>
                        </div>
                    )}
                </div>

                {/* Priority Task Queue — Interactive */}
                <div className="card">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                        <h3>⚡ DPDS Priority Queue</h3>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Click ✓ to mark complete</span>
                    </div>

                    {loading && <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading adaptive schedule…</div>}
                    {!loading && data?.scheduledTasks.length === 0 && (
                        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                            🎉 All tasks complete! Great work today.
                        </div>
                    )}
                    {data?.scheduledTasks && data.scheduledTasks.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {data.scheduledTasks.map((task, i) => (
                                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s ease" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}>
                                    {/* Rank */}
                                    <span style={{ fontWeight: 800, color: i === 0 ? "var(--primary)" : "var(--text-muted)", fontSize: "0.85rem", width: 24 }}>#{i + 1}</span>
                                    {/* Task info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                                        {task.description && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{task.description}</div>}
                                    </div>
                                    <ComplexityBadge n={task.complexity} />
                                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{task.estimatedDuration}m</span>
                                    <DeadlineBadge deadline={task.deadline} />
                                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)", width: 32, textAlign: "right" }}>{task.priority}</span>
                                    {/* Complete button */}
                                    <button
                                        onClick={() => handleComplete(task.id)}
                                        disabled={completing === task.id}
                                        title="Mark as complete"
                                        style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.4)", background: completing === task.id ? "rgba(52,211,153,0.3)" : "transparent", color: "var(--success)", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.2)"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                                    >
                                        {completing === task.id ? "…" : "✓"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.25rem" }}>
                    {[
                        { href: "/study", icon: "📖", label: "Study Engine", sub: "SM-2 Flashcards" },
                        { href: "/resources", icon: "🌐", label: "Free Resources", sub: "Personalised picks" },
                        { href: "/habits", icon: "🔥", label: "Habit Tracker", sub: "ABA Fading" },
                        { href: "/analytics", icon: "📊", label: "Analytics", sub: "Radar & Heatmaps" },
                    ].map(link => (
                        <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                            <div className="card" style={{ padding: "1rem 1.25rem", cursor: "pointer" }}>
                                <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
                                <div style={{ fontWeight: 700, marginTop: "0.5rem" }}>{link.label}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{link.sub}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Role banners */}
                {role === "PROFESSOR" && (
                    <div className="card" style={{ marginTop: "1.25rem", borderColor: "rgba(34,211,238,0.3)" }}>
                        <h3 style={{ marginBottom: "0.5rem" }}>👩‍🏫 Professor View</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Access aggregate class-level Analytics — Radar charts and stress heatmaps across your enrolled cohort.</p>
                    </div>
                )}
                {role === "ADMIN" && (
                    <div className="card" style={{ marginTop: "1.25rem", borderColor: "rgba(248,113,113,0.3)" }}>
                        <h3 style={{ marginBottom: "0.5rem" }}>🛡️ Admin Panel Access</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Full platform access granted. Manage users, view system health, and configure parameters from the <Link href="/admin" style={{ color: "var(--primary)" }}>Admin Panel</Link>.</p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
