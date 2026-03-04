"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const DEMO_ACCOUNTS = [
    { email: "srikar@demo.com", role: "Srikar", icon: "🦁" },
    { email: "alex@bio-adaptive.edu", role: "Student", icon: "🎓" },
    { email: "admin@bio-adaptive.edu", role: "Admin", icon: "🛡️" },
    { email: "sarah@bio-adaptive.edu", role: "Professor", icon: "📚" },
    { email: "guest@bio-adaptive.edu", role: "Normal", icon: "👤" },
];

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("demo");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent, overrideEmail?: string) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await signIn("credentials", {
            email: overrideEmail ?? email,
            password,
            redirect: false,
        });
        setLoading(false);
        if (result?.ok) {
            router.push("/dashboard");
        } else {
            setError("Invalid credentials. Use a demo account below.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            {/* Background blobs */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none"
            }}>
                <div style={{ position: "absolute", top: "10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />
                <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
            </div>

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16,
                        background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2rem", margin: "0 auto 1rem",
                        boxShadow: "0 0 30px rgba(99,102,241,0.5)"
                    }}>🧠</div>
                    <h1 style={{ fontSize: "1.75rem", fontFamily: "'Outfit', sans-serif" }}>
                        <span className="gradient-text">BioAdaptive</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                        Learning Platform — Sign in to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="card" style={{ padding: "2rem" }}>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: 600 }}>
                                Email Address
                            </label>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email.edu"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: 600 }}>
                                Password
                            </label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Any password works for demo"
                            />
                        </div>
                        {error && (
                            <div style={{ padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1rem" }}>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "0.85rem" }}
                            disabled={loading}
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                        <div style={{ flex: 1, height: 1, background: "var(--bg-glass-border)" }} />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Quick Demo Login</span>
                        <div style={{ flex: 1, height: 1, background: "var(--bg-glass-border)" }} />
                    </div>

                    {/* Demo accounts */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                        {DEMO_ACCOUNTS.map(acc => (
                            <button
                                key={acc.email}
                                className="btn btn-ghost"
                                style={{ fontSize: "0.8rem", justifyContent: "flex-start", gap: "0.5rem" }}
                                onClick={e => {
                                    setEmail(acc.email);
                                    handleLogin(e, acc.email);
                                }}
                            >
                                <span>{acc.icon}</span>
                                <span>{acc.role}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "1.5rem" }}>
                    Prototype — All data is synthetic. AES-256 · TLS 1.3 · GDPR compliant.
                </p>
            </div>
        </div>
    );
}
