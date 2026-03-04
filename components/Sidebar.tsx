"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
    { href: "/navigator", label: "Goal Navigator", icon: "✨" },
    { href: "/dashboard", label: "Dashboard", icon: "⚡" },
    { href: "/study", label: "Study Engine", icon: "📖" },
    { href: "/habits", label: "Habit Tracker", icon: "🔥" },
    { href: "/resources", label: "Resources", icon: "🌐" },
    { href: "/finder", label: "Smart Finder", icon: "🔎" },
    { href: "/analytics", label: "Analytics", icon: "📊" },
    { href: "/schedule", label: "Schedule", icon: "🗓️" },
    { href: "/roadmap", label: "My Roadmap", icon: "🗺️" },
];

const ADMIN_ITEMS = [
    { href: "/admin", label: "Admin Panel", icon: "🛡️" },
];

const BADGE_COLORS: Record<string, string> = {
    ADMIN: "badge-admin", STUDENT: "badge-student", PROFESSOR: "badge-professor",
    NORMAL: "badge-normal", TECHNICAL: "badge-technical",
};

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const role = (session?.user as any)?.role ?? "STUDENT";

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">🧠</div>
                <div>
                    <div className="sidebar-logo-text">BioAdaptive</div>
                    <div className="sidebar-logo-sub">Learning Platform</div>
                </div>
            </div>

            {/* Main nav */}
            <div style={{ flex: 1, overflowY: "auto", margin: "1rem 0" }}>
                <div className="nav-section-label">Main</div>
                {NAV_ITEMS.map(item => (
                    <Link key={item.href} href={item.href} className={`nav-item${pathname.startsWith(item.href) ? " active" : ""}`}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                {/* Admin nav */}
                {role === "ADMIN" && (
                    <>
                        <div className="nav-section-label" style={{ marginTop: "0.75rem" }}>Admin</div>
                        {ADMIN_ITEMS.map(item => (
                            <Link key={item.href} href={item.href} className={`nav-item${pathname.startsWith(item.href) ? " active" : ""}`}>
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </>
                )}
            </div>

            {/* Bottom: User Card */}
            <div style={{ marginTop: "auto", borderTop: "1px solid var(--bg-glass-border)", paddingTop: "1.25rem" }}>
                {session?.user && (
                    <div style={{
                        padding: "1rem",
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--bg-glass-border)",
                        marginBottom: "0.75rem"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                                {session.user.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.name}</div>
                                <span className={`badge ${BADGE_COLORS[role] ?? "badge-student"}`} style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem" }}>
                                    {role.charAt(0) + role.slice(1).toLowerCase()}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                onClick={() => router.push("/login")}
                                className="nav-item"
                                style={{ margin: 0, padding: "0.4rem 0.6rem", fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "0.4rem" }}
                            >
                                <span>🔄</span> Switch
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="nav-item"
                                style={{ margin: 0, padding: "0.4rem 0.6rem", fontSize: "0.75rem", background: "rgba(248,113,113,0.1)", color: "var(--danger)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", gap: "0.4rem" }}
                            >
                                <span>🚪</span> Logout
                            </button>
                        </div>
                    </div>
                )}

                <Link href="/onboarding" className={`nav-item${pathname === "/onboarding" ? " active" : ""}`} style={{ fontSize: "0.85rem" }}>
                    <span>🧩</span>
                    <span>My Profile / Quiz</span>
                </Link>
            </div>
        </aside>
    );
}
