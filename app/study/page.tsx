"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

const FLASHCARDS = [
    {
        id: 1, subject: "Neuroscience",
        front: "What is the 'spacing effect' in memory consolidation?",
        back: "Memories are strengthened when study sessions are spaced over time rather than massed. Interleaved review forces retrieval, triggering re-encoding in long-term storage.",
        difficulty: 8,
    },
    {
        id: 2, subject: "Calculus",
        front: "State the Fundamental Theorem of Calculus — Part 1",
        back: "If f is continuous on [a, b], then F(x) = ∫ₐˣ f(t) dt is differentiable and F′(x) = f(x). The accumulation function's derivative returns the integrand.",
        difficulty: 7,
    },
    {
        id: 3, subject: "Psychology",
        front: "Define 'metacognition'",
        back: "Metacognition is 'thinking about one's own thinking'. It involves planning (preparatory), monitoring (performance), and evaluating (reflective) one's cognitive processes.",
        difficulty: 5,
    },
    {
        id: 4, subject: "Biology",
        front: "What is the role of the hippocampus in learning?",
        back: "The hippocampus is critical for forming new declarative (episodic + semantic) memories. It acts as a temporary storage buffer before memories are consolidated to the cortex during sleep.",
        difficulty: 6,
    },
];

const SM2_LABELS: Record<number, { label: string; color: string; nextIn: string }> = {
    0: { label: "Complete Blackout", color: "#f87171", nextIn: "Same session" },
    1: { label: "Incorrect — Recalled", color: "#fb923c", nextIn: "10 minutes" },
    2: { label: "Hard — Correct", color: "#fbbf24", nextIn: "1 day" },
    3: { label: "Correct w/ Effort", color: "#a3e635", nextIn: "3 days" },
    4: { label: "Good Recall", color: "#34d399", nextIn: "7 days" },
    5: { label: "Perfect Recall", color: "#6366f1", nextIn: "14+ days" },
};

const NUDGES = [
    {
        type: "prep", phase: "Preparatory", icon: "🧭", color: "nudge-prep",
        message: "Break this flashcard deck into micro-sessions of 4–6 cards. Set a clear intent: 'I will recall the key mechanism, not memorize verbatim.'"
    },
    {
        type: "perf", phase: "Performance", icon: "⚡", color: "nudge-performance",
        message: "You're halfway through. Pause and rate your focus (1–10). If below 6, switch to a lower-complexity card or take a 2-minute break."
    },
    {
        type: "reflect", phase: "Reflective", icon: "🔍", color: "nudge-reflective",
        message: "Session complete. Identify your 'lapse card' — the one you hesitated on. Schedule it for your next session within 24 hours (SM-2 interval)."
    },
];

export default function StudyPage() {
    const [cardIdx, setCardIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [nudgeIdx, setNudgeIdx] = useState(0);
    const [sessionDone, setSessionDone] = useState(false);

    const card = FLASHCARDS[cardIdx];
    const totalCards = FLASHCARDS.length;
    const rated = Object.keys(ratings).length;

    const handleRate = (score: number) => {
        setRatings(r => ({ ...r, [card.id]: score }));
        if (cardIdx < totalCards - 1) {
            setCardIdx(i => i + 1);
            setFlipped(false);
            if (cardIdx === 1) setNudgeIdx(1); // performance nudge mid-session
        } else {
            setSessionDone(true);
            setNudgeIdx(2); // reflective nudge at end
        }
    };

    const nudge = NUDGES[nudgeIdx];

    return (
        <AppShell>
            <div style={{ maxWidth: 800 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>📖 Study Engine</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
                    Spaced Repetition (SM-2 algorithm) with Metacognitive Scaffolding
                </p>

                {/* Progress */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>
                        <span>Card {Math.min(cardIdx + 1, totalCards)} of {totalCards}</span>
                        <span>{rated} rated · {totalCards - rated} remaining</span>
                    </div>
                    <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${(rated / totalCards) * 100}%` }} />
                    </div>
                </div>

                {/* Metacognitive Nudge */}
                <div className={`nudge ${nudge.color}`} style={{ marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{nudge.icon}</span>
                    <div>
                        <strong style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {nudge.phase} Nudge
                        </strong>
                        <p style={{ marginTop: 3, color: "var(--text-secondary)" }}>{nudge.message}</p>
                    </div>
                </div>

                {!sessionDone ? (
                    <>
                        {/* Subject badge */}
                        <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span className="badge badge-student">{card.subject}</span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                Complexity: {card.difficulty}/10
                            </span>
                        </div>

                        {/* Flashcard */}
                        <div className="flashcard" style={{ marginBottom: "1.5rem", minHeight: 220 }}>
                            <div className={`flashcard-inner${flipped ? " flipped" : ""}`} onClick={() => setFlipped(f => !f)} style={{ cursor: "pointer" }}>
                                <div className="flashcard-face">
                                    <div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Question
                                        </div>
                                        <p style={{ fontSize: "1.15rem", fontWeight: 600 }}>{card.front}</p>
                                        <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>Click to reveal answer</p>
                                    </div>
                                </div>
                                <div className="flashcard-face flashcard-back">
                                    <div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--accent)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                                            Answer
                                        </div>
                                        <p style={{ fontSize: "1rem", lineHeight: 1.7 }}>{card.back}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SM-2 Rating */}
                        {flipped && (
                            <div className="card">
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem", fontWeight: 600 }}>
                                    Rate your recall (SM-2 score):
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}>
                                    {[0, 1, 2, 3, 4, 5].map(score => (
                                        <button
                                            key={score}
                                            onClick={() => handleRate(score)}
                                            style={{
                                                padding: "0.6rem 0.25rem",
                                                borderRadius: 10,
                                                border: `1px solid ${SM2_LABELS[score].color}44`,
                                                background: `${SM2_LABELS[score].color}18`,
                                                color: SM2_LABELS[score].color,
                                                cursor: "pointer",
                                                textAlign: "center",
                                                transition: "all 0.2s ease",
                                                fontSize: "0.75rem",
                                                fontWeight: 700,
                                            }}
                                            title={`${SM2_LABELS[score].label} — Next review: ${SM2_LABELS[score].nextIn}`}
                                        >
                                            <div style={{ fontSize: "1.1rem" }}>{score}</div>
                                            <div style={{ marginTop: 2, fontSize: "0.65rem", opacity: 0.8 }}>{SM2_LABELS[score].nextIn}</div>
                                        </button>
                                    ))}
                                </div>
                                <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                    0 = Blackout · 3 = Correct with effort · 5 = Perfect — hover for details
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    /* Session Complete */
                    <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
                        <h2 style={{ marginBottom: "0.5rem" }}>Session Complete!</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                            Your SM-2 intervals have been computed. Review weak cards within the recommended intervals.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                            {FLASHCARDS.map(c => {
                                const score = ratings[c.id] ?? -1;
                                const info = score >= 0 ? SM2_LABELS[score] : { label: "Skipped", color: "#8b8ba8", nextIn: "—" };
                                return (
                                    <div key={c.id} style={{ padding: "0.5rem 1rem", borderRadius: 10, background: `${info.color}18`, border: `1px solid ${info.color}44`, textAlign: "center" }}>
                                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: info.color }}>{c.subject}</div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>Next: {info.nextIn}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="btn btn-primary" onClick={() => { setCardIdx(0); setFlipped(false); setRatings({}); setSessionDone(false); setNudgeIdx(0); }}>
                            Start New Session
                        </button>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
