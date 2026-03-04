"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ─── Data ────────────────────────────────────────────────────────────────
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Psychology", "Economics", "History", "Statistics", "Literature", "Engineering", "Medicine", "GATE", "Cybersecurity"];
const GOALS = ["Exam Preparation", "Skill Building", "Career Change", "Academic Research", "Personal Interest", "Professional Development"];
const LEARNING_STYLES = [
    { key: "Visual", icon: "👁️", desc: "Charts, diagrams, color-coding" },
    { key: "Auditory", icon: "🎧", desc: "Podcasts, lectures, verbal review" },
    { key: "Reading", icon: "📖", desc: "Textbooks, notes, written summaries" },
    { key: "Kinesthetic", icon: "🛠️", desc: "Labs, projects, hands-on practice" },
];
const CHRONOTYPES = [
    { key: "LION", icon: "🦁", label: "Early Riser", desc: "Peak: 6–10am" },
    { key: "BEAR", icon: "🐻", label: "Mid-day", desc: "Peak: 10am–2pm" },
    { key: "WOLF", icon: "🐺", label: "Night Owl", desc: "Peak: 6–10pm" },
    { key: "DOLPHIN", icon: "🐬", label: "Irregular", desc: "Flexible / erratic" },
];

// ─── Personality Quiz ────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
    { q: "When tackling a new topic, I prefer to:", A: "Explore broadly first", B: "Build a structured plan", C: "Discuss with others", D: "Jump into practice" },
    { q: "I retain information best through:", A: "Videos and diagrams", B: "Detailed notes", C: "Group discussions", D: "Exercises and labs" },
    { q: "My ideal study environment is:", A: "A cozy café with music", B: "Silent library", C: "Study group session", D: "Workshop / lab bench" },
    { q: "When I'm stuck on a problem, I:", A: "Look for a new angle", B: "Re-read systematically", C: "Ask a peer", D: "Try different solutions" },
    { q: "I tend to be motivated by:", A: "Curiosity and novelty", B: "Goals and progress", C: "Helping others", D: "Tangible outcomes" },
    { q: "I prefer learning resources that are:", A: "Diverse and exploratory", B: "Structured courses", C: "Community-driven", D: "Project-based" },
    { q: "My study sessions usually look like:", A: "Jumping between topics", B: "Focused single topic", C: "Collaborative review", D: "Practice problems" },
    { q: "When starting a project, I:", A: "Brainstorm widely", B: "Make a detailed plan", C: "Form a team first", D: "Start building immediately" },
    { q: "I get most frustrated when:", A: "Things are too rigid", B: "Plans aren't followed", C: "Working alone too long", D: "Too much theory, no practice" },
    { q: "After studying, I prefer to:", A: "Explore related topics", B: "Review my notes", C: "Discuss key points", D: "Apply what I learned" },
];

// Scoring: A=Explorer, B=Architect, C=Collaborator, D=Practitioner
function scoreQuiz(answers: string[]): { type: string; scores: Record<string, number>; description: string; strategy: string; color: string; icon: string } {
    const counts = { Explorer: 0, Architect: 0, Collaborator: 0, Practitioner: 0 };
    answers.forEach(a => {
        if (a === "A") counts.Explorer++;
        if (a === "B") counts.Architect++;
        if (a === "C") counts.Collaborator++;
        if (a === "D") counts.Practitioner++;
    });
    const type = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const PROFILES: Record<string, { description: string; strategy: string; color: string; icon: string }> = {
        Explorer: { description: "Curious and broad-minded. You thrive on novelty and cross-disciplinary connections.", strategy: "Use mind maps, diverse videos, and follow your curiosity across related subjects.", color: "#22d3ee", icon: "🧭" },
        Architect: { description: "Systematic and goal-oriented. You excel with structured plans and clear milestones.", strategy: "Use spaced repetition, create detailed outlines, and track progress with Gantt-style charts.", color: "#6366f1", icon: "📐" },
        Collaborator: { description: "Social and empathetic. You learn best through interaction, discussion, and sharing.", strategy: "Join study groups, use forums like Reddit r/learnprogramming, and teach concepts to others.", color: "#a78bfa", icon: "🤝" },
        Practitioner: { description: "Hands-on and results-driven. Real-world application makes concepts click for you.", strategy: "Prioritize projects, labs, and practice problems over passive reading or videos.", color: "#34d399", icon: "🛠️" },
    };
    return { type, scores: counts, ...PROFILES[type] };
}

const STEPS = ["Profile", "Health", "Personality Quiz", "Confirm"];

export default function OnboardingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    // Step 1 — Profile
    const [name, setName] = useState(session?.user?.name ?? "");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [learningStyle, setLearningStyle] = useState("Visual");
    const [chronotype, setChronotype] = useState("BEAR");
    const [institution, setInstitution] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [resourcePref, setResourcePref] = useState("Mixed");

    // Step 2 — Health
    const [sleep, setSleep] = useState(7.5);
    const [sleepQuality, setSleepQuality] = useState(7);
    const [stress, setStress] = useState(4);

    // Step 3 — Quiz
    const [answers, setAnswers] = useState<string[]>([]);
    const [quizStep, setQuizStep] = useState(0);
    const [quizResult, setQuizResult] = useState<ReturnType<typeof scoreQuiz> | null>(null);

    const toggleArr = (arr: string[], val: string) =>
        arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

    const handleAnswer = (ans: string) => {
        const next = [...answers, ans];
        setAnswers(next);
        if (quizStep < QUIZ_QUESTIONS.length - 1) {
            setQuizStep(q => q + 1);
        } else {
            setQuizResult(scoreQuiz(next));
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        await fetch("/api/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                profile: { subjects: selectedSubjects, goals: selectedGoals, learningStyle, chronotype, institution, gradeLevel, resourcePrefs: resourcePref },
                health: { sleepDuration: sleep, sleepQuality, stressLevel: stress },
                personality: quizResult ? { type: quizResult.type, scores: quizResult.scores } : null,
            }),
        });
        router.push("/dashboard");
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            {/* Ambient blobs */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "5%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
            </div>

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 640 }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 1rem", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>🧠</div>
                    <h1 style={{ fontSize: "1.6rem" }} className="gradient-text">Welcome to BioAdaptive</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>Let's personalise your learning experience — just {STEPS.length} quick steps</p>
                </div>

                {/* Step Progress Bar */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
                    {STEPS.map((s, i) => (
                        <div key={s} style={{ flex: 1 }}>
                            <div style={{ height: 4, borderRadius: 2, background: i <= step ? "var(--primary)" : "rgba(255,255,255,0.1)", transition: "background 0.4s ease" }} />
                            <div style={{ fontSize: "0.7rem", color: i <= step ? "var(--primary)" : "var(--text-muted)", marginTop: 4, textAlign: "center", fontWeight: 600 }}>{s}</div>
                        </div>
                    ))}
                </div>

                {/* ── STEP 0: Profile ── */}
                {step === 0 && (
                    <div className="card" style={{ padding: "2rem" }}>
                        <h2 style={{ marginBottom: "1.5rem" }}>👤 About You</h2>

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Your Name</label>
                        <input className="input" style={{ marginBottom: "1.25rem", marginTop: "0.4rem" }} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Institution (Optional)</label>
                        <input className="input" style={{ marginBottom: "1.25rem", marginTop: "0.4rem" }} value={institution} onChange={e => setInstitution(e.target.value)} placeholder="University / School / Self-taught" />

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Grade / Year Level (Optional)</label>
                        <input className="input" style={{ marginBottom: "1.5rem", marginTop: "0.4rem" }} value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} placeholder="e.g. Year 2, MSc, Self-study" />

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>Subjects You Study (pick all that apply)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            {SUBJECTS.map(s => (
                                <button key={s} className={`btn ${selectedSubjects.includes(s) ? "btn-primary" : "btn-ghost"}`}
                                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                                    onClick={() => setSelectedSubjects(prev => toggleArr(prev, s))}>
                                    {s}
                                </button>
                            ))}
                        </div>

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>Your Goals</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            {GOALS.map(g => (
                                <button key={g} className={`btn ${selectedGoals.includes(g) ? "btn-primary" : "btn-ghost"}`}
                                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                                    onClick={() => setSelectedGoals(prev => toggleArr(prev, g))}>
                                    {g}
                                </button>
                            ))}
                        </div>

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>Learning Style</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.5rem" }}>
                            {LEARNING_STYLES.map(l => (
                                <button key={l.key} onClick={() => setLearningStyle(l.key)}
                                    style={{ padding: "0.9rem", borderRadius: 12, border: `1px solid ${learningStyle === l.key ? "var(--primary)" : "var(--bg-glass-border)"}`, background: learningStyle === l.key ? "rgba(99,102,241,0.15)" : "var(--bg-card)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                                    <div style={{ fontSize: "1.3rem" }}>{l.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginTop: 4, color: learningStyle === l.key ? "var(--primary)" : "var(--text-primary)" }}>{l.key}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{l.desc}</div>
                                </button>
                            ))}
                        </div>

                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>Your Chronotype (Natural Energy Peak)</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.5rem" }}>
                            {CHRONOTYPES.map(c => (
                                <button key={c.key} onClick={() => setChronotype(c.key)}
                                    style={{ padding: "0.9rem", borderRadius: 12, border: `1px solid ${chronotype === c.key ? "var(--secondary)" : "var(--bg-glass-border)"}`, background: chronotype === c.key ? "rgba(34,211,238,0.12)" : "var(--bg-card)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                                    <div style={{ fontSize: "1.3rem" }}>{c.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginTop: 4, color: chronotype === c.key ? "var(--secondary)" : "var(--text-primary)" }}>{c.label}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{c.desc}</div>
                                </button>
                            ))}
                        </div>

                        <button className="btn btn-primary" style={{ width: "100%", padding: "0.85rem" }}
                            disabled={selectedSubjects.length === 0}
                            onClick={() => setStep(1)}>
                            Continue →
                        </button>
                        {selectedSubjects.length === 0 && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>Please select at least one subject</p>}
                    </div>
                )}

                {/* ── STEP 1: Health Baseline ── */}
                {step === 1 && (
                    <div className="card" style={{ padding: "2rem" }}>
                        <h2 style={{ marginBottom: "0.5rem" }}>💤 Health Baseline</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                            This helps the STNU engine modulate task difficulty based on your biopsychosocial state.
                        </p>

                        {[
                            { label: `Sleep Duration: ${sleep}h`, min: 3, max: 12, step: 0.5, value: sleep, onChange: setSleep, optimal: "Optimal: 6–8h", color: sleep >= 6 && sleep <= 8 ? "var(--success)" : "var(--warning)" },
                            { label: `Sleep Quality: ${sleepQuality}/10`, min: 1, max: 10, step: 1, value: sleepQuality, onChange: setSleepQuality, optimal: sleepQuality >= 7 ? "😴 Restful" : "😓 Disrupted", color: sleepQuality >= 7 ? "var(--success)" : "var(--warning)" },
                            { label: `Current Stress Level: ${stress}/10`, min: 1, max: 10, step: 1, value: stress, onChange: setStress, optimal: stress <= 4 ? "😌 Manageable" : stress <= 7 ? "😤 Moderate" : "😰 High", color: stress <= 4 ? "var(--success)" : stress <= 7 ? "var(--warning)" : "var(--danger)" },
                        ].map(item => (
                            <div key={item.label} style={{ marginBottom: "1.75rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{item.label}</span>
                                    <span style={{ fontSize: "0.8rem", color: item.color, fontWeight: 600 }}>{item.optimal}</span>
                                </div>
                                <input type="range" min={item.min} max={item.max} step={item.step} value={item.value}
                                    onChange={e => item.onChange(Number(e.target.value))}
                                    style={{ width: "100%", accentColor: item.color }} />
                            </div>
                        ))}

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
                            <button className="btn btn-primary" style={{ flex: 2, padding: "0.85rem" }} onClick={() => setStep(2)}>Continue →</button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Personality Quiz ── */}
                {step === 2 && (
                    <div className="card" style={{ padding: "2rem" }}>
                        {!quizResult ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                                    <h2>🧩 Personality Quiz</h2>
                                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>{quizStep + 1}/{QUIZ_QUESTIONS.length}</span>
                                </div>
                                <div className="progress-bar-track" style={{ marginBottom: "1.5rem" }}>
                                    <div className="progress-bar-fill" style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                                </div>
                                <p style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1.5rem", lineHeight: 1.5 }}>{QUIZ_QUESTIONS[quizStep].q}</p>
                                {(["A", "B", "C", "D"] as const).map(opt => (
                                    <button key={opt} onClick={() => handleAnswer(opt)}
                                        style={{ display: "flex", width: "100%", alignItems: "center", gap: "1rem", padding: "0.9rem 1.25rem", borderRadius: 12, border: "1px solid var(--bg-glass-border)", background: "var(--bg-card)", cursor: "pointer", marginBottom: "0.6rem", color: "var(--text-primary)", textAlign: "left", transition: "all 0.2s", fontSize: "0.9rem" }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--bg-glass-border)"; }}
                                    >
                                        <span style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--bg-glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>{opt}</span>
                                        {QUIZ_QUESTIONS[quizStep][opt]}
                                    </button>
                                ))}
                            </>
                        ) : (
                            // Quiz results
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>{quizResult.icon}</div>
                                <h2 style={{ marginBottom: "0.5rem" }}>You're an <span style={{ color: quizResult.color }}>{quizResult.type}</span></h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{quizResult.description}</p>
                                <div style={{ padding: "1rem 1.25rem", borderRadius: 12, background: `${quizResult.color}15`, border: `1px solid ${quizResult.color}30`, textAlign: "left", marginBottom: "1.5rem" }}>
                                    <strong style={{ color: quizResult.color, fontSize: "0.82rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>✨ Recommended Strategy</strong>
                                    <p style={{ marginTop: 6, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{quizResult.strategy}</p>
                                </div>
                                {/* Score bars */}
                                <div style={{ marginBottom: "1.5rem" }}>
                                    {Object.entries(quizResult.scores).map(([type, val]) => (
                                        <div key={type} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                            <span style={{ width: 90, textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{type}</span>
                                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                                                <div style={{ height: "100%", borderRadius: 3, background: type === quizResult.type ? quizResult.color : "rgba(255,255,255,0.2)", width: `${(val / QUIZ_QUESTIONS.length) * 100}%`, transition: "width 0.8s ease" }} />
                                            </div>
                                            <span style={{ width: 20, fontSize: "0.8rem", color: "var(--text-muted)" }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setAnswers([]); setQuizStep(0); setQuizResult(null); }}>Retake</button>
                                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>Finish →</button>
                                </div>
                            </div>
                        )}
                        {!quizResult && (
                            <button className="btn btn-ghost" style={{ width: "100%", marginTop: "0.75rem", fontSize: "0.82rem" }} onClick={() => { setStep(0); }}>← Back to Profile</button>
                        )}
                    </div>
                )}

                {/* ── STEP 3: Confirm ── */}
                {step === 3 && (
                    <div className="card" style={{ padding: "2rem" }}>
                        <h2 style={{ marginBottom: "1.5rem" }}>🚀 You're All Set!</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
                            {[
                                { icon: "📚", label: "Subjects", value: selectedSubjects.join(", ") || "None selected" },
                                { icon: "🎯", label: "Goals", value: selectedGoals.join(", ") || "None selected" },
                                { icon: "👁️", label: "Learning Style", value: learningStyle },
                                { icon: "⏰", label: "Chronotype", value: CHRONOTYPES.find(c => c.key === chronotype)?.label ?? chronotype },
                                { icon: "💤", label: "Sleep", value: `${sleep}h / Quality: ${sleepQuality}/10` },
                                { icon: "🧩", label: "Personality", value: quizResult?.type ?? "Not taken" },
                            ].map(row => (
                                <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--bg-glass-border)" }}>
                                    <span>{row.icon}</span>
                                    <div>
                                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</div>
                                        <div style={{ fontSize: "0.9rem", marginTop: 2 }}>{row.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                            <button className="btn btn-primary" style={{ flex: 2, padding: "0.85rem" }} onClick={handleSubmit} disabled={saving}>
                                {saving ? "Saving…" : "Go to Dashboard →"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
