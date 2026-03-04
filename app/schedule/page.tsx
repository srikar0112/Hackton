"use client";

import AppShell from "@/components/AppShell";

const SCHEDULE_EVENTS = [
    { time: "07:00", task: "Morning Review", complexity: 3, type: "light", dur: 30, reason: "🦁 LION peak — warm-up review works here" },
    { time: "08:00", task: "Calculus Practice", complexity: 9, type: "deep", dur: 90, reason: "⚡ Peak cognitive window — high-complexity scheduled" },
    { time: "09:30", task: "Break + Hydration", complexity: 0, type: "break", dur: 15, reason: "🔄 Ultradian cycle reset" },
    { time: "09:45", task: "Physics Problem Sets", complexity: 7, type: "deep", dur: 60, reason: "⚡ Still in peak window" },
    { time: "11:00", task: "Lecture Notes Review", complexity: 5, type: "medium", dur: 45, reason: "📝 Transitional period — medium complexity" },
    { time: "12:00", task: "Lunch Break", complexity: 0, type: "break", dur: 60, reason: "🍽️ Rest — cognitive recovery" },
    { time: "13:00", task: "Admin / Email", complexity: 2, type: "admin", dur: 30, reason: "🐻 Post-lunch trough — admin tasks only" },
    { time: "13:30", task: "Spaced Repetition", complexity: 4, type: "medium", dur: 45, reason: "🗂️ Flashcard queue — SM-2 intervals due" },
    { time: "14:15", task: "Literature Reading", complexity: 5, type: "medium", dur: 60, reason: "📚 Moderate complexity suits this window" },
    { time: "15:30", task: "Break", complexity: 0, type: "break", dur: 15, reason: "🔄 Ultradian cycle reset" },
    { time: "15:45", task: "Statistics Lab", complexity: 7, type: "deep", dur: 75, reason: "🐺 Second peak begins — re-engage complexity" },
    { time: "17:00", task: "Reflective Journaling", complexity: 2, type: "light", dur: 15, reason: "🔍 Metacognitive reflection — evaluate day's progress" },
    { time: "17:15", task: "Exercise", complexity: 0, type: "break", dur: 45, reason: "💪 BDNF boost — primes hippocampal memory consolidation" },
    { time: "21:00", task: "Light Review", complexity: 3, type: "light", dur: 30, reason: "🌙 Pre-sleep review aids overnight consolidation" },
];

const TYPE_COLORS: Record<string, string> = {
    deep: "#6366f1",
    medium: "#22d3ee",
    light: "#34d399",
    admin: "#fbbf24",
    break: "#5a5a78",
};

const TYPE_LABELS: Record<string, string> = {
    deep: "Deep Work", medium: "Medium", light: "Light", admin: "Admin", break: "Break",
};

export default function SchedulePage() {
    return (
        <AppShell>
            <div style={{ maxWidth: 900 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>🗓️ STNU Daily Schedule</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                    Tasks are dynamically ordered by DPDS algorithm — adapts to your biopsychosocial state
                </p>

                {/* Legend */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: TYPE_COLORS[k] }} />
                            {v}
                        </div>
                    ))}
                </div>

                {/* Timeline */}
                <div className="card" style={{ padding: "1.25rem" }}>
                    {SCHEDULE_EVENTS.map((ev, i) => (
                        <div key={i} style={{
                            display: "flex", gap: "1rem", alignItems: "flex-start",
                            paddingBottom: i < SCHEDULE_EVENTS.length - 1 ? "1rem" : 0,
                            marginBottom: i < SCHEDULE_EVENTS.length - 1 ? "1rem" : 0,
                            borderBottom: i < SCHEDULE_EVENTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        }}>
                            {/* Time */}
                            <div style={{ width: 52, flexShrink: 0, textAlign: "right" }}>
                                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "monospace" }}>
                                    {ev.time}
                                </span>
                            </div>

                            {/* Color bar */}
                            <div style={{
                                width: 4, borderRadius: 2, flexShrink: 0, alignSelf: "stretch", minHeight: 20,
                                background: TYPE_COLORS[ev.type],
                                opacity: ev.type === "break" ? 0.4 : 0.9,
                            }} />

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{ev.task}</span>
                                    {ev.type !== "break" && (
                                        <span style={{
                                            fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 999,
                                            background: `${TYPE_COLORS[ev.type]}22`,
                                            color: TYPE_COLORS[ev.type],
                                            fontWeight: 700,
                                            border: `1px solid ${TYPE_COLORS[ev.type]}44`
                                        }}>
                                            {TYPE_LABELS[ev.type]}
                                        </span>
                                    )}
                                    {ev.dur > 0 && (
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ev.dur}min</span>
                                    )}
                                    {ev.complexity > 0 && (
                                        <span style={{
                                            fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 999,
                                            background: ev.complexity >= 7 ? "rgba(248,113,113,0.15)" : ev.complexity >= 4 ? "rgba(251,191,36,0.15)" : "rgba(52,211,153,0.15)",
                                            color: ev.complexity >= 7 ? "#f87171" : ev.complexity >= 4 ? "#fbbf24" : "#34d399",
                                        }}>
                                            C{ev.complexity}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>
                                    {ev.reason}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* STNU explanation */}
                <div className="card" style={{ marginTop: "1.25rem", borderColor: "rgba(99,102,241,0.3)" }}>
                    <h3 style={{ marginBottom: "0.75rem" }}>📐 How the STNU Engine Works</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        Each task is modeled as a <strong>Simple Temporal Network with Uncertainty (STNU)</strong>:
                        duration is a bounded stochastic variable <code style={{ background: "rgba(255,255,255,0.07)", padding: "0 4px", borderRadius: 4 }}>d ∈ [d_min, d_max]</code>.
                        The <strong>DPDS algorithm</strong> enforces <em>dynamic controllability</em> — guaranteeing hard deadline compliance even as actual durations fluctuate.
                        Task assignment is further modulated by real-time <strong>biopsychosocial state</strong> (sleep quality, stress index) to prevent cognitive overload during low-energy windows.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
