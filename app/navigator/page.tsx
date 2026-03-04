"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function NavigatorPage() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [goalData, setGoalData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setErrorMsg("");
        setGoalData(null);

        try {
            const res = await fetch("/api/navigator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();

            if (data.unmatched) {
                setErrorMsg(data.message);
            } else if (data.goal) {
                setGoalData(data.goal);
            } else {
                setErrorMsg("An unexpected error occurred.");
            }
        } catch (err) {
            setErrorMsg("Network error trying to map goal.");
        } finally {
            setLoading(false);
        }
    };

    const clearGoal = () => {
        setPrompt("");
        setGoalData(null);
        setErrorMsg("");
    };

    // ─── STATE OF FOCUS: The goal is mapped, show ONLY relevant data ───
    if (goalData) {
        return (
            <AppShell>
                <style>{`.focus-card:hover { transform: translateY(-3px) !important; }`}</style>
                <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>

                    <button onClick={clearGoal} className="btn btn-ghost" style={{ marginBottom: "1.5rem", fontSize: "0.85rem" }}>
                        ← Choose a different goal
                    </button>

                    {/* Header */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 0 30px rgba(99,102,241,0.4)", flexShrink: 0 }}>
                            {goalData.pillar === "Academic+" ? "🎓" : "🚀"}
                        </div>
                        <div>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.25rem" }}>
                                <span className="badge" style={{ background: goalData.pillar === "Academic+" ? "rgba(99,102,241,0.15)" : "rgba(52,211,153,0.15)", color: goalData.pillar === "Academic+" ? "var(--primary)" : "var(--success)" }}>
                                    {goalData.pillar} Pillar
                                </span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                    Est. Timeline: {goalData.timelineMonths} months
                                </span>
                            </div>
                            <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>{goalData.title}</h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 700, lineHeight: 1.5 }}>
                                {goalData.description}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>

                        {/* Left Col: Roadmap Timeline */}
                        <div>
                            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                🗺️ Success Roadmap
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {goalData.roadmapPhases.map((phase: any, i: number) => (
                                    <div key={i} className="card focus-card" style={{ padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                                        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--primary)" }} />
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{i + 1}. {phase.phase}</div>
                                            <div className="badge badge-normal">{phase.duration}</div>
                                        </div>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1rem" }}>{phase.focus}</p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                            {phase.milestones.map((m: string) => (
                                                <div key={m} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                                                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>✓</span>
                                                    <span>{m}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Col: Strict Requirements & Resources */}
                        <div>
                            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>⚠️ Absolute Requirements</h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                                {/* Exams */}
                                {goalData.requirements.exams && (
                                    <div className="card" style={{ padding: "1.25rem", borderTop: "2px solid #ef4444" }}>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>Required Exams</div>
                                        {goalData.requirements.exams.map((e: string) => <div key={e} style={{ fontSize: "0.9rem", padding: "0.3rem 0" }}>• {e}</div>)}
                                    </div>
                                )}
                                {/* Physical */}
                                {goalData.requirements.physical && (
                                    <div className="card" style={{ padding: "1.25rem", borderTop: "2px solid #34d399" }}>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>Physical/Medical</div>
                                        {goalData.requirements.physical.map((p: string) => <div key={p} style={{ fontSize: "0.9rem", padding: "0.3rem 0" }}>• {p}</div>)}
                                    </div>
                                )}
                                {/* Financial */}
                                {goalData.requirements.financial && (
                                    <div className="card" style={{ padding: "1.25rem", borderTop: "2px solid #fbbf24" }}>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>Financial Estimation</div>
                                        {goalData.requirements.financial.map((f: string) => <div key={f} style={{ fontSize: "0.9rem", padding: "0.3rem 0" }}>• {f}</div>)}
                                    </div>
                                )}
                                {/* Equipment */}
                                {goalData.requirements.equipment && (
                                    <div className="card" style={{ padding: "1.25rem", borderTop: "2px solid #8b8ba8" }}>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>Mandatory Equipment</div>
                                        {goalData.requirements.equipment.map((e: string) => <div key={e} style={{ fontSize: "0.9rem", padding: "0.3rem 0" }}>• {e}</div>)}
                                    </div>
                                )}
                            </div>

                            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>📚 Curated Resources</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {goalData.resources.map((r: any) => (
                                    <a key={r.title} href={r.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                                        <div className="card focus-card" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.title}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{r.type}</div>
                                            </div>
                                            <span style={{ color: "var(--primary)" }}>↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </AppShell>
        );
    }

    // ─── STATE OF INTENT: Sparse, prompt-first landing page ───
    return (
        <AppShell>
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>

                {/* Decorative background glow */}
                <div style={{ position: "absolute", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 700, textAlign: "center" }}>
                    <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.02em", background: "linear-gradient(to right, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        What is your ultimate goal?
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: 1.6 }}>
                        Don't worry about the how. Just tell us the *what*.<br />
                        Whether it's cracking UPSC, getting into grad school, or running a marathon.
                    </p>

                    <form onSubmit={handleSubmit} style={{ position: "relative" }}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.03)", borderRadius: 24, padding: "0.5rem", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px inset rgba(255,255,255,0.05)", transition: "all 0.3s ease", ...(prompt ? { borderColor: "rgba(99,102,241,0.5)", boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.1)" } : {}) }}>
                            <span style={{ fontSize: "1.5rem", padding: "0 1rem", color: "var(--text-muted)" }}>✨</span>
                            <input
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g. 'I want to crack the UPSC exams in 2025' or 'I want to be a software engineer'"
                                style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "1.15rem", padding: "1rem 0", outline: "none" }}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!prompt.trim() || loading}
                                className="btn btn-primary"
                                style={{ borderRadius: 20, padding: "1rem 2rem", fontSize: "1.05rem", opacity: !prompt.trim() || loading ? 0.5 : 1 }}
                            >
                                {loading ? "Generating Roadmap…" : "Generate Roadmap"}
                            </button>
                        </div>
                    </form>

                    {errorMsg && (
                        <div style={{ marginTop: "1.5rem", color: "var(--danger)", background: "rgba(248,113,113,0.1)", padding: "1rem", borderRadius: 12, fontSize: "0.9rem", border: "1px solid rgba(248,113,113,0.2)", display: "inline-block" }}>
                            {errorMsg}
                        </div>
                    )}

                    <div style={{ marginTop: "4rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "var(--primary)" }}>✓</span> Academic+ Pillar</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "var(--success)" }}>✓</span> Life & Career Pillar</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "var(--accent)" }}>✓</span> Physical & Wellness</div>
                    </div>
                </div>

            </div>
        </AppShell>
    );
}
