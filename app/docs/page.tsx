import AppShell from "@/components/AppShell";

const SECTIONS = [
    {
        id: "tech-stack",
        icon: "⚙️",
        title: "Technology Stack",
        content: [
            {
                name: "Next.js 15 (App Router)",
                tag: "Framework",
                desc: "Provides full-stack React development with Server Components, server actions, and built-in API routes. Chosen for zero-config SSR/SSG and optimized page performance.",
                links: ["https://nextjs.org/docs"],
            },
            {
                name: "Prisma ORM v5 + SQLite",
                tag: "Database",
                desc: "Prisma provides a type-safe ORM layer. SQLite is used for the prototype (file: ./dev.db) — easily swappable to PostgreSQL for production using the same schema. Entities: User, Task, HealthMetric, StudySession.",
                links: ["https://www.prisma.io/docs"],
            },
            {
                name: "NextAuth.js",
                tag: "Authentication",
                desc: "Role-based credential authentication. JWT strategy with custom session callbacks that attach the user's Role (ADMIN/STUDENT/PROFESSOR/NORMAL/TECHNICAL) and ID to every session token.",
                links: ["https://next-auth.js.org/"],
            },
            {
                name: "Recharts",
                tag: "Visualization",
                desc: "React-native chart library used for: RadarChart (subject proficiency), ScatterChart (study-stress heatmap), BarChart (Gantt milestones + weekly retention), and ResponsiveContainer for fluid layouts.",
                links: ["https://recharts.org/"],
            },
            {
                name: "Vanilla CSS Design System",
                tag: "Styling",
                desc: "Custom CSS with design tokens (HSL-based palette, border radii, shadows). Features glassmorphism cards, micro-animations, gradient text, habit heatmap dots, flashcard 3D flip, and responsive sidebar.",
                links: [],
            },
        ],
    },
    {
        id: "stnu",
        icon: "📐",
        title: "STNU Scheduling Algorithm",
        content: [
            {
                name: "Simple Temporal Networks with Uncertainty (STNU)",
                tag: "Algorithm",
                desc: "Each task duration is modeled as a bounded stochastic variable d ∈ [d_min, d_max]. The system maintains 'dynamic controllability' — guaranteeing all hard deadlines are met even when actual task execution time varies randomly within bounds.",
                links: [],
            },
            {
                name: "Deadline Preference Dispatch Scheduling (DPDS)",
                tag: "Algorithm",
                desc: "Tasks are ranked by a composite priority score: P = 0.6 × urgency + 0.4 × (complexity × biopsychosocial_modifier). Urgency is computed as a function of time-to-deadline vs. estimated duration. High-complexity tasks are blocked when energy < threshold.",
                links: [],
            },
            {
                name: "Chronotype Mapping",
                tag: "Feature",
                desc: "Each user is assigned a chronotype (LION/BEAR/WOLF/DOLPHIN). The schedule engine maps high-complexity tasks (C ≥ 7) to the user's peak energy window and routes administrative tasks (C ≤ 3) to post-lunch troughs.",
                links: [],
            },
        ],
    },
    {
        id: "pedagogy",
        icon: "📚",
        title: "Pedagogical Logic",
        content: [
            {
                name: "SM-2 Spaced Repetition",
                tag: "Retention",
                desc: "Flashcards are rated 0–5 post-recall. SM-2 calculates next review interval: score < 3 repeats same day; score 3 → 1 day; score 4 → 3 days; score 5 → 7+ days. This combats the 'forgetting curve' through strategic re-encoding.",
                links: [],
            },
            {
                name: "Metacognitive Scaffolding (3-Phase Nudges)",
                tag: "Engagement",
                desc: "Three types of AI nudges are triggered: (1) Preparatory — before a session (task planning, intent setting), (2) Performance — mid-session (focus monitoring, complexity adjustment), (3) Reflective — after a session (review of approach effectiveness, lapse card identification).",
                links: [],
            },
            {
                name: "ABA Fading Technique",
                tag: "Autonomy",
                desc: "Applied Behavior Analysis fading: reminders and planning assistance gradually reduce as habit streak grows. Full prompting (0–2 days) → Partial prompt (3–6 days) → Light reminder (7–13 days) → Fully faded/autonomous (14+ day streak). Students gradually own their own learning.",
                links: [],
            },
        ],
    },
    {
        id: "roles",
        icon: "👥",
        title: "Role Architecture",
        content: [
            {
                name: "ADMIN",
                tag: "Role",
                desc: "Full platform access. Manages user accounts, views system health metrics, configures scheduling parameters, and accesses the compliance dashboard. Can access /admin route exclusively.",
                links: [],
            },
            {
                name: "STUDENT",
                tag: "Role",
                desc: "Primary user persona. Access to Dashboard (personalized STNU schedule), Study Engine (SM-2 flashcards, nudges), Habit Tracker (ABA fading heatmap), Schedule (chronotype-mapped timeline), and Analytics (own proficiency radar).",
                links: [],
            },
            {
                name: "PROFESSOR",
                tag: "Role",
                desc: "Access to all Student features plus aggregated class-level Analytics showing cohort-wide radar charts and stress-study heatmaps. Can create shared task templates for enrolled students.",
                links: [],
            },
            {
                name: "NORMAL",
                tag: "Role",
                desc: "General public / parent observer. Read-only access to the Dashboard and Schedule views. Cannot access sensitive Health Metrics or Admin panel.",
                links: [],
            },
            {
                name: "TECHNICAL",
                tag: "Role",
                desc: "Platform engineers and support staff. Access to system diagnostics, API logs, and Database schema inspector. Cannot access student health or study data (FERPA compliance).",
                links: [],
            },
        ],
    },
    {
        id: "compliance",
        icon: "🔐",
        title: "Security & Compliance",
        content: [
            {
                name: "Encryption",
                tag: "Security",
                desc: "AES-256 at rest for all stored data. TLS 1.3 enforced in transit between client and server. JWT tokens are signed with a 32-byte NEXTAUTH_SECRET.",
                links: [],
            },
            {
                name: "GDPR, FERPA, COPPA",
                tag: "Compliance",
                desc: "GDPR: Right-to-erasure (user data deletion via Prisma cascade). FERPA: Student health/study data isolated by userId — Technical role cannot access student records. COPPA: Age verification required for under-13 users at onboarding.",
                links: [],
            },
            {
                name: "Performance SLA",
                tag: "Performance",
                desc: "Target: 95% of user actions complete in < 3 seconds. Achieved via Next.js Server Components (zero client waterfall for initial state), Prisma query optimization, and edge-ready middleware.",
                links: [],
            },
        ],
    },
];

const TAG_COLORS: Record<string, string> = {
    Framework: "#6366f1", Database: "#22d3ee", Authentication: "#a78bfa",
    Visualization: "#34d399", Styling: "#fbbf24",
    Algorithm: "#f87171", Feature: "#fb923c",
    Retention: "#6366f1", Engagement: "#22d3ee", Autonomy: "#34d399",
    Role: "#a78bfa", Security: "#f87171", Compliance: "#fbbf24", Performance: "#34d399",
};

export default function DocsPage() {
    return (
        <AppShell>
            <div style={{ maxWidth: 900 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>📄 Documentation Hub</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    Technical specifications, pedagogical framework, and role architecture
                </p>

                {/* Quick nav */}
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2rem", padding: "1rem", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--bg-glass-border)" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, marginRight: 4 }}>Jump to:</span>
                    {SECTIONS.map(s => (
                        <a key={s.id} href={`#${s.id}`} style={{
                            fontSize: "0.8rem", color: "var(--text-secondary)",
                            textDecoration: "none", padding: "0.2rem 0.6rem",
                            borderRadius: 6, background: "rgba(255,255,255,0.05)",
                            transition: "all 0.2s"
                        }}>
                            {s.icon} {s.title}
                        </a>
                    ))}
                </div>

                {SECTIONS.map(section => (
                    <div key={section.id} id={section.id} style={{ marginBottom: "2rem" }}>
                        <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span>{section.icon}</span>
                            <span className="gradient-text">{section.title}</span>
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                            {section.content.map(item => (
                                <div key={item.name} className="card" style={{ padding: "1.25rem" }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                                        <h3 style={{ fontSize: "1rem", flex: 1 }}>{item.name}</h3>
                                        <span style={{
                                            fontSize: "0.72rem", padding: "0.2rem 0.65rem", borderRadius: 999, fontWeight: 700,
                                            background: `${TAG_COLORS[item.tag] ?? "#6366f1"}22`,
                                            color: TAG_COLORS[item.tag] ?? "#6366f1",
                                            border: `1px solid ${TAG_COLORS[item.tag] ?? "#6366f1"}44`,
                                            whiteSpace: "nowrap",
                                        }}>
                                            {item.tag}
                                        </span>
                                    </div>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7 }}>
                                        {item.desc}
                                    </p>
                                    {item.links.length > 0 && (
                                        <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem" }}>
                                            {item.links.map(link => (
                                                <a key={link} href={link} target="_blank" rel="noreferrer" style={{
                                                    fontSize: "0.78rem", color: "var(--primary)", textDecoration: "none",
                                                    padding: "0.2rem 0.6rem", borderRadius: 6, background: "rgba(99,102,241,0.1)",
                                                    border: "1px solid rgba(99,102,241,0.25)",
                                                }}>
                                                    ↗ Docs
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Bottom note */}
                <div className="card" style={{ borderColor: "rgba(99,102,241,0.3)", textAlign: "center", padding: "2rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚀</div>
                    <h3 style={{ marginBottom: "0.5rem" }}>Production Roadmap</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 500, margin: "0 auto" }}>
                        Phase 2 will add real LMS connectors (Moodle/Canvas REST API), wearable sync (Apple Health / Google Fit), and a live AI model (Gemini API) to generate personalized content recommendations from OER hubs like OpenStax and MIT OpenCourseWare.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
