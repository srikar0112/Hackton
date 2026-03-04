"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

            {/* User pill */}
            {session?.user && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: 12, background: "rgba(255,255,255,0.04)", marginBottom: "1.25rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.name}</div>
                        <span className={`badge ${BADGE_COLORS[role] ?? "badge-student"}`} style={{ marginTop: 2 }}>
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                        </span>
                    </div>
                </div>
            )}

            {/* Main nav */}
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

            <div style={{ flex: 1 }} />

            {/* Bottom: onboarding + sign out */}
            <div className="nav-section-label">Account</div>
            <Link href="/onboarding" className={`nav-item${pathname === "/onboarding" ? " active" : ""}`}>
                <span>🧩</span>
                <span>My Profile / Quiz</span>
            </Link>
            <button className="nav-item" onClick={() => signOut({ callbackUrl: "/login" })} style={{ color: "var(--danger)", marginTop: "0.25rem" }}>
                <span>🚪</span>
                <span>Sign Out</span>
            </button>
        </aside>
    );
}
