"use client";

import { useEffect, useState, useCallback } from "react";
import AppShell from "@/components/AppShell";

type Resource = {
    id: string; subject: string; title: string; type: string;
    tags: string[]; url: string; source: string; free: boolean; score?: number;
};

const TYPE_ICONS: Record<string, string> = {
    Video: "🎥", Course: "🎓", Textbook: "📚", Practice: "💪",
};
const TYPE_COLORS: Record<string, string> = {
    Video: "#f87171", Course: "#6366f1", Textbook: "#22d3ee", Practice: "#34d399",
};
const SUBJECTS = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Psychology", "Economics", "History", "Statistics"];
const TYPES = ["All", "Video", "Course", "Textbook", "Practice"];

function ResourceCard({ resource }: { resource: Resource }) {
    const color = TYPE_COLORS[resource.type] ?? "#6366f1";
    return (
        <a href={resource.url} target="_blank" rel="noreferrer"
            style={{ display: "block", textDecoration: "none" }}
            className="resource-card">
            <div className="card" style={{ padding: "1.25rem", height: "100%", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                {/* Accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

                {/* Score badge (recommended) */}
                {resource.score && resource.score > 5 && (
                    <div style={{ position: "absolute", top: 12, right: 12, padding: "0.2rem 0.5rem", borderRadius: 999, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", fontSize: "0.7rem", fontWeight: 700, color: "var(--primary)" }}>
                        ⭐ For You
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "1.4rem" }}>{TYPE_ICONS[resource.type] ?? "📄"}</span>
                    <div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{resource.type}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{resource.source}</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "rgba(52,211,153,0.15)", color: "var(--success)", fontWeight: 700 }}>FREE</span>
                </div>

                <h3 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", lineHeight: 1.4 }}>{resource.title}</h3>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    {resource.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ fontSize: "0.68rem", padding: "0.15rem 0.45rem", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>{t}</span>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--primary)" }}>
                    Open Resource <span>↗</span>
                </div>
            </div>
        </a>
    );
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [userSubjects, setUserSubjects] = useState<string[]>([]);
    const [userPersonality, setUserPersonality] = useState<string | null>(null);
    const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [subject, setSubject] = useState("All");
    const [type, setType] = useState("All");
    const [loading, setLoading] = useState(true);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(t);
    }, [query]);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("q", debouncedQuery);
        if (subject !== "All") params.set("subject", subject);
        if (type !== "All") params.set("type", type);
        const res = await fetch(`/api/resources?${params}`);
        const data = await res.json();
        setResources(data.resources ?? []);
        setUserSubjects(data.userSubjects ?? []);
        setUserPersonality(data.userPersonality ?? null);
        setPrimaryGoal(data.primaryGoal ?? null);
        setLoading(false);
    }, [debouncedQuery, subject, type]);

    useEffect(() => { fetchResources(); }, [fetchResources]);

    const recommended = resources.filter(r => (r.score ?? 0) > 5);
    const others = resources.filter(r => (r.score ?? 0) <= 5);

    return (
        <AppShell>
            <style>{`.resource-card .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(99,102,241,0.15); }`}</style>
            <div style={{ maxWidth: 1100 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>📚 Free Resource Hub</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    Curated free learning resources from OpenStax, MIT OCW, Khan Academy, and more.
                </p>

                {primaryGoal && primaryGoal !== "General Learning" && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.75rem", borderRadius: 8, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", marginBottom: "1.75rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>🎯</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Strictly filtered for:</span>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--secondary)" }}>{primaryGoal}</span>
                    </div>
                )}
                <div style={{ marginBottom: primaryGoal && primaryGoal !== "General Learning" ? "0" : "1.75rem" }} />

                {/* Filters */}
                <div className="card" style={{ marginBottom: "1.5rem", padding: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                        <input
                            className="input" style={{ flex: "1 1 220px", minWidth: 0 }}
                            value={query} onChange={e => setQuery(e.target.value)}
                            placeholder="🔍 Search resources, subjects, or topics…"
                        />
                        <select className="input" style={{ flex: "0 0 160px" }} value={subject} onChange={e => setSubject(e.target.value)}>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select className="input" style={{ flex: "0 0 130px" }} value={type} onChange={e => setType(e.target.value)}>
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {userSubjects.length > 0 && (
                        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>YOUR SUBJECTS:</span>
                            {userSubjects.map(s => (
                                <button key={s} onClick={() => setSubject(s === subject ? "All" : s)}
                                    className={`btn ${subject === s ? "btn-primary" : "btn-ghost"}`}
                                    style={{ fontSize: "0.75rem", padding: "0.2rem 0.65rem" }}>{s}</button>
                            ))}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading resources…</div>
                ) : resources.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🔍</div>
                        <p>No resources found. Try a different search or filter.</p>
                    </div>
                ) : (
                    <>
                        {/* Recommended section */}
                        {recommended.length > 0 && (
                            <>
                                <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <h2 style={{ fontSize: "1.1rem" }}>⭐ Recommended For You</h2>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Based on your subjects and {userPersonality} personality</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                                    {recommended.map(r => <ResourceCard key={r.id} resource={r} />)}
                                </div>
                            </>
                        )}

                        {/* All resources */}
                        {others.length > 0 && (
                            <>
                                <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                                    {recommended.length > 0 ? "📖 More Resources" : `📖 Resources (${resources.length})`}
                                </h2>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                                    {others.map(r => <ResourceCard key={r.id} resource={r} />)}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </AppShell>
    );
}
