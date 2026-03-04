"use client";

import { useState, useRef, useCallback } from "react";
import AppShell from "@/components/AppShell";

/* ─── Internet Search Engines ──────────────────────────────────────────────── */
const SEARCH_ENGINES = [
    { key: "google-main", icon: "🔍", label: "Google", build: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`, color: "#4285F4" },
    { key: "khan", icon: "📐", label: "Khan Academy", build: (q: string) => `https://www.khanacademy.org/search?referer=%2F&page_search_query=${encodeURIComponent(q)}`, color: "#14BF96" },
    { key: "youtube", icon: "🎥", label: "YouTube", build: (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " tutorial free")}`, color: "#f87171" },
    { key: "scholar", icon: "🎓", label: "Google Scholar", build: (q: string) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`, color: "#6366f1" },
    { key: "mitocw", icon: "🏛️", label: "MIT OpenCourseWare", build: (q: string) => `https://ocw.mit.edu/search/?q=${encodeURIComponent(q)}`, color: "#22d3ee" },
    { key: "openstax", icon: "📚", label: "OpenStax", build: (q: string) => `https://openstax.org/search?q=${encodeURIComponent(q)}`, color: "#f97316" },
    { key: "coursera", icon: "📘", label: "Coursera (Free)", build: (q: string) => `https://www.coursera.org/search?query=${encodeURIComponent(q)}&price=Free`, color: "#0056D2" },
    { key: "freecodecamp", icon: "💻", label: "freeCodeCamp", build: (q: string) => `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(q)}`, color: "#0A0A23" },
    { key: "libretexts", icon: "📖", label: "LibreTexts", build: (q: string) => `https://www.libretexts.org/search?q=${encodeURIComponent(q)}`, color: "#34d399" },
    { key: "wikipedia", icon: "🌐", label: "Wikipedia", build: (q: string) => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`, color: "#8b8ba8" },
    { key: "google-edu", icon: "🎯", label: "Google (Education)", build: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q + " free course tutorial OR textbook")}`, color: "#fbbf24" },
];

/* ─── Recent queries: keep last 8 ─────────────────────────────────────────── */
function getRecent(): string[] {
    try { return JSON.parse(localStorage.getItem("bio_recent") ?? "[]").slice(0, 8); } catch { return []; }
}
function addRecent(q: string) {
    try {
        const list = getRecent().filter(x => x !== q);
        list.unshift(q);
        localStorage.setItem("bio_recent", JSON.stringify(list.slice(0, 8)));
    } catch { /* ignore */ }
}

/* ─── Suggested queries based on popular student topics ────────────────────── */
const QUICK_TOPICS = [
    "Calculus derivatives", "Quantum mechanics", "Python programming", "Organic chemistry",
    "Statistics probability", "Machine learning", "Cell biology", "Linear algebra",
    "Data structures", "Thermodynamics", "Shakespeare", "Microeconomics",
];

export default function FinderPage() {
    const [query, setQuery] = useState("");
    const [activeQuery, setActiveQuery] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [ocrText, setOcrText] = useState("");
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [recentQueries, setRecentQueries] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    // Load recent queries on mount
    useState(() => { setRecentQueries(getRecent()); });

    /* ─── Image Upload + OCR ──────────────────────────────────────────────────── */
    const processImage = useCallback(async (file: File) => {
        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // OCR
        setOcrLoading(true);
        setOcrProgress(0);
        setOcrText("");
        try {
            const TesseractModule = await import("tesseract.js");
            const Tesseract = TesseractModule.default || TesseractModule;
            const result = await Tesseract.recognize(file, "eng", {
                logger: (m: any) => {
                    if (m.status === "recognizing text") setOcrProgress(Math.round(m.progress * 100));
                },
            });
            const text = result.data.text.trim();
            setOcrText(text);
            if (text) {
                // Auto-fill the query bar with extracted keywords
                const keywords = text
                    .split(/[\n\r]+/)
                    .filter((line: string) => line.trim().length > 3)
                    .slice(0, 3)
                    .join(" ")
                    .replace(/[^a-zA-Z0-9\s]/g, "")
                    .trim()
                    .slice(0, 120);
                setQuery(keywords);
            }
        } catch (err) {
            console.error("OCR Error:", err);
            setOcrText("⚠️ Could not extract text. Try a clearer image.");
        }
        setOcrLoading(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) processImage(file);
    }, [processImage]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processImage(file);
    };

    /* ─── Search ──────────────────────────────────────────────────────────────── */
    const handleSearch = (q?: string) => {
        const searchQuery = q ?? query;
        if (!searchQuery.trim()) return;
        setActiveQuery(searchQuery.trim());
        addRecent(searchQuery.trim());
        setRecentQueries(getRecent());
    };

    const clearAll = () => {
        setQuery(""); setActiveQuery(null); setImagePreview(null); setOcrText(""); setOcrProgress(0);
    };

    return (
        <AppShell>
            <style>{`
        .finder-engine:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(99,102,241,0.15) !important; }
        .drop-zone-active { border-color: var(--primary) !important; background: rgba(99,102,241,0.08) !important; }
        .topic-chip:hover { background: rgba(99,102,241,0.2) !important; color: var(--primary) !important; }
      `}</style>
            <div style={{ maxWidth: 1000 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>🔎 Smart Resource Finder</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
                    Upload an image (textbook page, notes, problem set) or type any topic — we'll find free resources across the internet
                </p>

                {/* ── Input Area ── */}
                <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                    {/* Text input + Search button */}
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
                        <input
                            className="input"
                            style={{ flex: 1, fontSize: "1rem", padding: "0.85rem 1.25rem" }}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                            placeholder="Type a topic, concept, or question… (e.g. 'integration by parts')"
                        />
                        <button className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem", whiteSpace: "nowrap" }} onClick={() => handleSearch()}>
                            🔍 Find Resources
                        </button>
                    </div>

                    {/* Image upload zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={dragOver ? "drop-zone-active" : ""}
                        style={{
                            border: "2px dashed rgba(255,255,255,0.12)",
                            borderRadius: 16,
                            padding: imagePreview ? "1rem" : "2rem",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: dragOver ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)",
                            position: "relative",
                        }}
                    >
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />

                        {!imagePreview ? (
                            <>
                                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", opacity: 0.7 }}>📷</div>
                                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Drag & drop an image, or click to upload</div>
                                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                    Supports: Textbook pages, handwritten notes, problem sets, screenshots
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                                    We'll extract text via OCR (runs locally in your browser — nothing is uploaded to any server)
                                </div>
                            </>
                        ) : (
                            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", textAlign: "left" }}>
                                {/* Uploaded image preview */}
                                <div style={{ flexShrink: 0, width: 200 }}>
                                    <img src={imagePreview} alt="Uploaded" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--bg-glass-border)" }} />
                                    <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); setOcrText(""); }} className="btn btn-ghost" style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.78rem" }}>
                                        Remove Image
                                    </button>
                                </div>
                                {/* OCR results */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        📝 Extracted Text
                                        {ocrLoading && <span style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 500 }}>Processing… {ocrProgress}%</span>}
                                    </div>
                                    {ocrLoading && (
                                        <div className="progress-bar-track" style={{ marginBottom: "0.75rem" }}>
                                            <div className="progress-bar-fill" style={{ width: `${ocrProgress}%` }} />
                                        </div>
                                    )}
                                    {ocrText ? (
                                        <div style={{ padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--bg-glass-border)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                                            {ocrText}
                                        </div>
                                    ) : !ocrLoading ? (
                                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>No text extracted yet.</p>
                                    ) : null}
                                    {ocrText && !ocrLoading && (
                                        <button className="btn btn-primary" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}
                                            onClick={(e) => { e.stopPropagation(); handleSearch(); }}>
                                            🔍 Search with extracted text
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick topics */}
                    {!activeQuery && (
                        <div style={{ marginTop: "1.25rem" }}>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Popular Topics</div>
                            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                {QUICK_TOPICS.map(t => (
                                    <button key={t} className="topic-chip" onClick={() => { setQuery(t); handleSearch(t); }}
                                        style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s" }}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent searches */}
                    {!activeQuery && recentQueries.length > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recent Searches</div>
                            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                {recentQueries.map(q => (
                                    <button key={q} className="topic-chip" onClick={() => { setQuery(q); handleSearch(q); }}
                                        style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem", borderRadius: 999, background: "rgba(167,139,250,0.1)", color: "var(--accent)", border: "1px solid rgba(167,139,250,0.2)", cursor: "pointer", transition: "all 0.2s" }}>
                                        🕐 {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Search Results ── */}
                {activeQuery && (
                    <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                            <div>
                                <h2 style={{ fontSize: "1.15rem" }}>
                                    Results for: <span style={{ color: "var(--primary)" }}>"{activeQuery}"</span>
                                </h2>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
                                    Click any source below to search for free resources on that platform
                                </p>
                            </div>
                            <button className="btn btn-ghost" style={{ fontSize: "0.82rem" }} onClick={clearAll}>
                                ✕ Clear
                            </button>
                        </div>

                        {/* Search engine cards grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                            {SEARCH_ENGINES.map(engine => (
                                <a key={engine.key} href={engine.build(activeQuery)} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }} className="finder-engine">
                                    <div className="card" style={{ padding: "1.25rem", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.25s ease" }}>
                                        {/* Color accent top */}
                                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${engine.color}, ${engine.color}88)` }} />
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <span style={{ fontSize: "1.8rem" }}>{engine.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{engine.label}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                                                    Search "{activeQuery.slice(0, 30)}{activeQuery.length > 30 ? "…" : ""}"
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "1.1rem", color: engine.color, fontWeight: 700 }}>↗</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Also search our internal resources */}
                        <InternalResourceMatch query={activeQuery} />
                    </>
                )}
            </div>
        </AppShell>
    );
}

/* ─── Internal Resource Matcher ────────────────────────────────────────────── */
function InternalResourceMatch({ query }: { query: string }) {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useState(() => {
        (async () => {
            const res = await fetch(`/api/resources?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResources(data.resources?.slice(0, 6) ?? []);
            setLoading(false);
        })();
    });

    if (loading) return <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)" }}>Checking our library…</div>;
    if (resources.length === 0) return null;

    const TYPE_ICONS: Record<string, string> = { Video: "🎥", Course: "🎓", Textbook: "📚", Practice: "💪" };
    const TYPE_COLORS: Record<string, string> = { Video: "#f87171", Course: "#6366f1", Textbook: "#22d3ee", Practice: "#34d399" };

    return (
        <>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>📚 From Our Library ({resources.length} matches)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {resources.map((r: any) => {
                    const color = TYPE_COLORS[r.type] ?? "#6366f1";
                    return (
                        <a key={r.id} href={r.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                            <div className="card" style={{ padding: "1.15rem", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
                                {r.score > 5 && (
                                    <div style={{ position: "absolute", top: 10, right: 10, padding: "0.15rem 0.5rem", borderRadius: 999, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", fontSize: "0.68rem", fontWeight: 700, color: "var(--primary)" }}>⭐ Recommended</div>
                                )}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", marginTop: "0.25rem" }}>
                                    <span style={{ fontSize: "1.2rem" }}>{TYPE_ICONS[r.type] ?? "📄"}</span>
                                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color, textTransform: "uppercase" }}>{r.type}</div>
                                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>·</span>
                                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{r.source}</span>
                                    <span style={{ marginLeft: "auto", fontSize: "0.68rem", padding: "0.1rem 0.4rem", borderRadius: 6, background: "rgba(52,211,153,0.15)", color: "var(--success)", fontWeight: 700 }}>FREE</span>
                                </div>
                                <h3 style={{ fontSize: "0.9rem", marginBottom: "0.4rem", lineHeight: 1.4 }}>{r.title}</h3>
                                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                                    {r.tags?.slice(0, 3).map((t: string) => (
                                        <span key={t} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </>
    );
}
