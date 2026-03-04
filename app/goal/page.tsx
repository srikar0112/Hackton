"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function GoalPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [goal, setGoal] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setSaving(true);
        // We'll reuse the onboarding endpoint to update the goals but keep the rest untouched
        // Let's create a dedicated API or just call a user profile update route.
        // For simplicity, we can fetch existing profile and just update the goal.
        try {
            const profileRes = await fetch("/api/onboarding");
            const data = await profileRes.json();

            const currentProfile = data.profile || {};

            await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profile: {
                        ...currentProfile,
                        goals: [goal], // Overwrite goals with the new primary prompt
                    },
                    health: null,
                    personality: null,
                }),
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to save goal", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--bg-main)" }}>
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(100px)" }} />
            </div>

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 600, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 2rem", boxShadow: "0 0 40px rgba(99,102,241,0.3)" }}>
                    🎯
                </div>

                <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontFamily: "'Outfit', sans-serif" }}>
                    What is your primary <span className="gradient-text">Focus</span>?
                </h1>

                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "3rem", lineHeight: 1.6 }}>
                    State your exact objective, e.g., "I want to become a commercial pilot in 2 years" or "Pass the UPSC exams". The entire platform will adapt precisely to this goal.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input
                        autoFocus
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Type your goal here..."
                        style={{
                            width: "100%",
                            padding: "1.25rem 1.5rem",
                            fontSize: "1.2rem",
                            borderRadius: 16,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text-primary)",
                            textAlign: "center",
                            outline: "none",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                            transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.boxShadow = "0 10px 40px rgba(99,102,241,0.2)";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                        }}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            padding: "1.2rem",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            borderRadius: 16,
                            opacity: goal.length > 3 ? 1 : 0.5,
                            transform: goal.length > 3 ? "translateY(0)" : "translateY(10px)",
                            transition: "all 0.3s ease",
                            pointerEvents: goal.length > 3 ? "auto" : "none"
                        }}
                        disabled={saving || goal.length <= 3}
                    >
                        {saving ? "Generating Environment..." : "Enter State of Focus →"}
                    </button>
                </form>
            </div>
        </div>
    );
}
