"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

// 16 weeks × 7 days of habit data (synthetic)
function generateHabitData() {
    const habits = ["Study Session", "Sleep 7h+", "Exercise", "Meditation", "No Social Media"];
    const weeks = 16;
    const data: Record<string, number[][]> = {};
    habits.forEach(h => {
        data[h] = Array.from({ length: weeks }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => {
                const base = Math.random();
                const trend = (w / weeks) * 0.3; // improving trend over time (ABA fading)
                const raw = base + trend;
                if (raw > 0.85) return 4;
                if (raw > 0.65) return 3;
                if (raw > 0.4) return 2;
                if (raw > 0.2) return 1;
                return 0;
            })
        );
    });
    return { habits, data, weeks };
}

const { habits, data: habitData, weeks } = generateHabitData();

const DOT_COLORS: Record<number, string> = {
    0: "habit-dot-empty",
    1: "habit-dot-low",
    2: "habit-dot-medium",
    3: "habit-dot-high",
    4: "habit-dot-perfect",
};

const STREAK_THRESHOLD = 3;

function computeStreak(habit: string): number {
    const flat = habitData[habit].flatMap(w => w).reverse();
    let streak = 0;
    for (const v of flat) {
        if (v >= STREAK_THRESHOLD) streak++;
        else break;
    }
    return streak;
}

// ABA Fading: as streak grows, reminder intensity decreases
function fadeLevel(streak: number): { label: string; color: string } {
    if (streak < 3) return { label: "💬 Full Prompting", color: "var(--primary)" };
    if (streak < 7) return { label: "🔔 Partial Prompt", color: "var(--secondary)" };
    if (streak < 14) return { label: "⏰ Light Reminder", color: "var(--success)" };
    return { label: "🤫 Faded Out — Autonomous!", color: "var(--accent)" };
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsPage() {
    const [selected, setSelected] = useState(habits[0]);
    const streakVal = computeStreak(selected);
    const fade = fadeLevel(streakVal);

    return (
        <AppShell>
            <div style={{ maxWidth: 900 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>🔥 Habit Tracker</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
                    ABA Fading — automated reminders diminish as habit stability grows
                </p>

                {/* Habit selector */}
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    {habits.map(h => (
                        <button key={h} className={`btn ${selected === h ? "btn-primary" : "btn-ghost"}`}
                            style={{ fontSize: "0.82rem" }}
                            onClick={() => setSelected(h)}>
                            {h}
                        </button>
                    ))}
                </div>

                {/* Streak + ABA status */}
                <div className="stat-grid" style={{ marginBottom: "1.5rem", gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <div className="stat-card">
                        <div className="stat-label">Current Streak</div>
                        <div className="stat-value" style={{ color: "var(--warning)" }}>{streakVal}d 🔥</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">ABA Fade Level</div>
                        <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: 4, color: fade.color }}>{fade.label}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Completion Rate</div>
                        <div className="stat-value" style={{ color: "var(--success)" }}>
                            {Math.round((habitData[selected].flat().filter(v => v > 0).length / (weeks * 7)) * 100)}%
                        </div>
                    </div>
                </div>

                {/* ABA nudge */}
                <div className={`nudge ${streakVal < 7 ? "nudge-prep" : "nudge-reflective"}`} style={{ marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{fade.label.split(" ")[0]}</span>
                    <div>
                        <strong>ABA Fading Status:</strong>{" "}
                        {streakVal < 3
                            ? "Starting out — full scaffolding active. We'll remind you every day at your optimal chronotype window."
                            : streakVal < 7
                                ? "Building momentum — partial prompts only. Keep going for 7 days to reduce reminder frequency."
                                : streakVal < 14
                                    ? "Habit forming — light reminders only once you skip a day. You're becoming autonomous!"
                                    : "Mastered habit — reminder system fully faded. The behavior is now self-sustaining. 🎉"}
                    </div>
                </div>

                {/* Heatmap Grid */}
                <div className="card">
                    <h3 style={{ marginBottom: "0.75rem" }}>📅 16-Week Heatmap — {selected}</h3>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        {DAYS.map((d, i) => (
                            <div key={i} style={{ width: 14, textAlign: "center", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700 }}>{d}</div>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {habitData[selected].map((week, wi) => (
                            <div key={wi} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                {week.map((val, di) => (
                                    <div
                                        key={di}
                                        className={`habit-dot ${DOT_COLORS[val]}`}
                                        title={`Week ${wi + 1}, ${DAYS[di]}: Level ${val}`}
                                    />
                                ))}
                                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginLeft: 6 }}>W{wi + 1}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Less</span>
                        {[0, 1, 2, 3, 4].map(v => (
                            <div key={v} className={`habit-dot ${DOT_COLORS[v]}`} />
                        ))}
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>More</span>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
