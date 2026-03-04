"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

type Block = { time: string; activity: string; duration: number; type: string; reason: string };
type WeekDay = { day: string; theme: string; hours: number };
type Phase = { phase: string; weeks: string; focus: string; milestones: string[] };
type RoadmapData = {
    personalityType: string; chronotype: string; subjects: string[]; primaryGoal: string;
    dailySchedule: Block[]; weeklyFocus: WeekDay[]; roadmapPhases: Phase[];
    studyTips: string[]; optimalSessionLength: number; breakPattern: string;
    weeklyHours: number; activeTasks: { id: string; title: string; complexity: number; deadline: string }[];
};

const TYPE_COLORS: Record<string, string> = {
    deep: "#6366f1", medium: "#22d3ee", light: "#34d399", break: "#fbbf24", admin: "#a78bfa",
};
const TYPE_LABELS: Record<string, string> = {
    deep: "Deep Work", medium: "Active Study", light: "Light Review", break: "Break", admin: "Planning",
};
const PERSONALITY_META: Record<string, { icon: string; color: string; tagline: string }> = {
    Explorer: { icon: "🧭", color: "#22d3ee", tagline: "Curiosity-driven | Diverse | Visual" },
    Architect: { icon: "📐", color: "#6366f1", tagline: "Systematic | Goal-oriented | Structured" },
    Collaborator: { icon: "🤝", color: "#a78bfa", tagline: "Social | Discussion-based | Empathetic" },
    Practitioner: { icon: "🛠️", color: "#34d399", tagline: "Hands-on | Project-based | Kinesthetic" },
};
const CHRONO_LABELS: Record<string, string> = {
    LION: "🦁 Early Riser", BEAR: "🐻 Mid-day Peak", WOLF: "🐺 Night Owl", DOLPHIN: "🐬 Irregular",
};

export default function RoadmapPage() {
    const [data, setData] = useState<RoadmapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "roadmap">("daily");

    useEffect(() => {
        fetch("/api/roadmap").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <AppShell><div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Loading your personalised roadmap…</div></AppShell>;
    if (!data) return <AppShell><div style={{ textAlign: "center", padding: "4rem" }}>Please complete onboarding first.</div></AppShell>;

    const meta = PERSONALITY_META[data.personalityType] ?? PERSONALITY_META.Architect;

    return (
        <AppShell>
            <style>{`
        .phase-card:hover { transform: translateY(-3px) !important; }
        .tip-card:hover { transform: translateX(4px) !important; }
      `}</style>
            <div style={{ maxWidth: 1100 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${meta.color}, ${meta.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: `0 0 30px ${meta.color}40`, flexShrink: 0 }}>
                        {meta.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
                            <span style={{ color: meta.color }}>{data.personalityType}</span> Learning Roadmap
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{meta.tagline}</p>

                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.75rem", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.5rem" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>TARGET GOAL:</span>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{data.primaryGoal}</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                            <span className="badge badge-student">{CHRONO_LABELS[data.chronotype] ?? data.chronotype}</span>
                            <span className="badge badge-normal">{data.weeklyHours}h / week</span>
                            <span className="badge badge-technical">{data.optimalSessionLength}min sessions</span>
                            <span className="badge badge-professor">{data.breakPattern}</span>
                        </div>
                    </div>
                </div>

                {/* Subjects */}
                {data.subjects.length > 0 && (
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, alignSelf: "center" }}>YOUR SUBJECTS:</span>
                        {data.subjects.map((s: string) => (
                            <span key={s} style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "var(--primary)", fontWeight: 600 }}>{s}</span>
                        ))}
                    </div>
                )}

                {/* Tab Switcher */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    {([["daily", "📅 Daily Schedule"], ["weekly", "📊 Weekly Plan"], ["roadmap", "🗺️ 16-Week Roadmap"]] as const).map(([key, label]) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`btn ${activeTab === key ? "btn-primary" : "btn-ghost"}`}
                            style={{ fontSize: "0.88rem" }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── DAILY SCHEDULE ── */}
                {activeTab === "daily" && (
                    <div>
                        <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
                            Today's Adaptive Schedule
                            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: "0.5rem" }}>
                                (Adjusted for {CHRONO_LABELS[data.chronotype]} chronotype)
                            </span>
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {data.dailySchedule.map((block, i) => {
                                const color = TYPE_COLORS[block.type] ?? "#6366f1";
                                return (
                                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "stretch" }}>
                                        {/* Time column */}
                                        <div style={{ width: 60, flexShrink: 0, textAlign: "right", paddingTop: "0.85rem" }}>
                                            <span style={{ fontWeight: 800, fontSize: "0.9rem", fontFamily: "'Outfit',sans-serif", color: i === 0 ? meta.color : "var(--text-primary)" }}>{block.time}</span>
                                        </div>
                                        {/* Timeline dot + line */}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, border: `2px solid ${color}`, boxShadow: `0 0 8px ${color}40`, flexShrink: 0, marginTop: 14 }} />
                                            {i < data.dailySchedule.length - 1 && <div style={{ flex: 1, width: 2, background: `linear-gradient(180deg, ${color}60, rgba(255,255,255,0.06))` }} />}
                                        </div>
                                        {/* Card */}
                                        <div className="card" style={{ flex: 1, padding: "0.85rem 1.15rem", position: "relative", overflow: "hidden" }}>
                                            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: color }} />
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>{block.activity}</span>
                                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 999, background: `${color}20`, color, fontWeight: 700 }}>{TYPE_LABELS[block.type]}</span>
                                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{block.duration}m</span>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{block.reason}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── WEEKLY PLAN ── */}
                {activeTab === "weekly" && (
                    <div>
                        <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Weekly Focus Plan</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
                            {data.weeklyFocus.map(day => {
                                const isWeekend = day.day === "Saturday" || day.day === "Sunday";
                                return (
                                    <div key={day.day} className="card" style={{ padding: "1.15rem", borderColor: isWeekend ? "rgba(52,211,153,0.2)" : undefined }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                            <span style={{ fontWeight: 800, fontSize: "0.9rem", color: isWeekend ? "var(--success)" : "var(--text-primary)" }}>{day.day}</span>
                                            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>{day.hours}h</span>
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{day.theme}</div>
                                        {/* Hours bar */}
                                        <div className="progress-bar-track" style={{ marginTop: "0.75rem" }}>
                                            <div className="progress-bar-fill" style={{ width: `${(day.hours / 5) * 100}%`, background: isWeekend ? "var(--success)" : undefined }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Active tasks */}
                        {data.activeTasks.length > 0 && (
                            <>
                                <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>📋 Your Active Tasks</h3>
                                <div className="card" style={{ padding: "1rem" }}>
                                    {data.activeTasks.map((t, i) => (
                                        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < data.activeTasks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                                            <span style={{ fontWeight: 800, color: "var(--text-muted)", fontSize: "0.8rem", width: 24 }}>#{i + 1}</span>
                                            <span style={{ flex: 1, fontSize: "0.9rem" }}>{t.title}</span>
                                            <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: 999, background: t.complexity >= 7 ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)", color: t.complexity >= 7 ? "var(--danger)" : "var(--success)", fontWeight: 700 }}>C{t.complexity}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── 16-WEEK ROADMAP ── */}
                {activeTab === "roadmap" && (
                    <div>
                        <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
                            🗺️ 16-Week Phase Plan
                            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: "0.5rem" }}>
                                Tailored for: {data.primaryGoal}
                            </span>
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                            {data.roadmapPhases.map((phase, i) => {
                                const phaseColors = ["#6366f1", "#22d3ee", "#a78bfa", "#34d399"];
                                const pc = phaseColors[i % phaseColors.length];
                                return (
                                    <div key={phase.phase} className="card phase-card" style={{ padding: "1.5rem", position: "relative", overflow: "hidden", transition: "all 0.25s" }}>
                                        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${pc}, ${pc}66)` }} />
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                                            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${pc}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: pc, border: `1px solid ${pc}40` }}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{phase.phase}</div>
                                                <div style={{ fontSize: "0.78rem", color: pc, fontWeight: 600 }}>{phase.weeks}</div>
                                            </div>
                                        </div>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "0.75rem" }}>{phase.focus}</p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                            {phase.milestones.map(m => (
                                                <div key={m} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                                                    <span style={{ color: pc, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>◆</span>
                                                    <span>{m}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Study Tips — always visible */}
                <div className="card" style={{ padding: "1.5rem", marginTop: "1rem" }}>
                    <h3 style={{ marginBottom: "0.75rem" }}>💡 Study Tips for {data.personalityType} Learners</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {data.studyTips.map((tip, i) => (
                            <div key={i} className="tip-card" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.65rem 0.85rem", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s" }}>
                                <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>✨</span>
                                <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
