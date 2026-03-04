"use client";

import AppShell from "@/components/AppShell";
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    Cell, Tooltip, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis,
    BarChart, Bar
} from "recharts";

import { useEffect, useState } from "react";

// Data structures
type RadarData = { subject: string; score: number; fullMark: number };
type ScatterData = { x: number; y: number; z: number };
type GanttData = { name: string; plan_start: number; plan_dur: number; label: string };
type WeeklyData = { day: string; hours: number; retention: number };

// Removed static data constants

const RADAR_COLOR = "#6366f1";
const SCATTER_COLORS = ["#6366f1", "#22d3ee", "#a78bfa"];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.85rem" }}>
                {payload.map((p: any, i: number) => (
                    <div key={i} style={{ color: p.color ?? "var(--text-primary)" }}>
                        {p.name}: <strong>{p.value}</strong>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsPage() {
    const [radarData, setRadarData] = useState<RadarData[]>([]);
    const [scatterData, setScatterData] = useState<ScatterData[]>([]);
    const [ganttData, setGanttData] = useState<GanttData[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/analytics")
            .then(res => res.json())
            .then(data => {
                setRadarData(data.radarData);
                setScatterData(data.scatterData);
                setGanttData(data.ganttData);
                setWeeklyData(data.weeklyData);
                setPrimaryGoal(data.primaryGoal);
                setLoading(false);
            })
            .catch(err => console.error("Analytics fetch failed", err));
    }, []);

    if (loading) {
        return (
            <AppShell>
                <div style={{ height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
                    <div className="shimmer" style={{ width: 100, height: 100, borderRadius: "50%" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Synthesizing your adaptive analytics...</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div style={{ maxWidth: 1100 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>📊 Analytics Hub</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
                    Radar proficiency · {primaryGoal ? `Focus: ${primaryGoal}` : "Metrics Heatmap"} · Goal alignment
                </p>

                {/* Row 1: Radar + Scatter */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    {/* Radar */}
                    <div className="card">
                        <h3 style={{ marginBottom: "1rem" }}>🎯 Subject Proficiency Radar</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b8ba8", fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#5a5a78", fontSize: 10 }} />
                                <Radar name="Score" dataKey="score" stroke={RADAR_COLOR} fill={RADAR_COLOR} fillOpacity={0.25} strokeWidth={2} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#8b8ba8" }} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                            Based on SM-2 retention scores across last 30 study sessions.
                        </p>
                    </div>

                    {/* Scatter / Heatmap */}
                    <div className="card">
                        <h3 style={{ marginBottom: "0.5rem" }}>🌡️ Study Intensity × Stress Correlation</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                            Bubble size = retention score. Optimal zone: low stress + 3–5h study.
                        </p>
                        <ResponsiveContainer width="100%" height={250}>
                            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="x" name="Study Hours" unit="h" tick={{ fill: "#8b8ba8", fontSize: 11 }} label={{ value: "Study Hours", position: "insideBottom", offset: -10, fill: "#5a5a78", fontSize: 11 }} />
                                <YAxis dataKey="y" name="Stress Level" domain={[0, 10]} tick={{ fill: "#8b8ba8", fontSize: 11 }} label={{ value: "Stress", angle: -90, position: "insideLeft", fill: "#5a5a78", fontSize: 11 }} />
                                <ZAxis dataKey="z" range={[60, 300]} name="Retention" />
                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                                <Scatter data={scatterData} fill="#6366f1" fillOpacity={0.7} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Row 2: Gantt */}
                <div className="card" style={{ marginBottom: "1.25rem" }}>
                    <h3 style={{ marginBottom: "1rem" }}>📅 Project Gantt — 90-Day Roadmap</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            layout="vertical"
                            data={ganttData}
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" domain={[0, 90]} unit=" d" tick={{ fill: "#8b8ba8", fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: "#8b8ba8", fontSize: 11 }} width={75} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="plan_start" stackId="a" fill="transparent" />
                            <Bar dataKey="plan_dur" stackId="a" fill="#6366f1" fillOpacity={0.75} radius={[0, 4, 4, 0]}>
                                {ganttData.map((_, i) => (
                                    <Cell key={i} fill={i < 3 ? "#6366f1" : "#a78bfa"} fillOpacity={0.75} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, background: "#6366f1" }} /> Monthly Phases
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, background: "#a78bfa" }} /> Sprint Milestones
                        </div>
                    </div>
                </div>

                {/* Weekly bar chart */}
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>📈 Weekly Study vs Retention</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: "#8b8ba8", fontSize: 12 }} />
                            <YAxis yAxisId="left" tick={{ fill: "#8b8ba8", fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b8ba8", fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#8b8ba8" }} />
                            <Bar yAxisId="left" dataKey="hours" name="Study Hours" fill="#6366f1" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="retention" name="Retention %" fill="#22d3ee" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AppShell>
    );
}
