"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useSession } from "next-auth/react";

const USERS_MOCK = [
    { id: "1", name: "Admin User", email: "admin@bio-adaptive.edu", role: "ADMIN", chronotype: "BEAR", joined: "2025-01-01" },
    { id: "2", name: "Alex Student", email: "alex@bio-adaptive.edu", role: "STUDENT", chronotype: "WOLF", joined: "2025-09-01" },
    { id: "3", name: "Dr. Sarah Prof", email: "sarah@bio-adaptive.edu", role: "PROFESSOR", chronotype: "LION", joined: "2025-01-15" },
    { id: "4", name: "Guest Parent", email: "guest@bio-adaptive.edu", role: "NORMAL", chronotype: "BEAR", joined: "2025-10-01" },
    { id: "5", name: "Tech Support", email: "support@bio-adaptive.edu", role: "TECHNICAL", chronotype: "DOLPHIN", joined: "2025-02-01" },
];

const ROLE_BADGE: Record<string, string> = {
    ADMIN: "badge-admin", STUDENT: "badge-student", PROFESSOR: "badge-professor",
    NORMAL: "badge-normal", TECHNICAL: "badge-technical",
};

const SYSTEM_METRICS = [
    { label: "Total Users", value: "5", color: "var(--primary)" },
    { label: "Active Sessions", value: "3", color: "var(--success)" },
    { label: "DB Size", value: "412 KB", color: "var(--secondary)" },
    { label: "Uptime", value: "99.8%", color: "var(--accent)" },
    { label: "API Calls/hr", value: "147", color: "var(--warning)" },
    { label: "Avg. Response", value: "230ms", color: "var(--success)" },
];

export default function AdminPage() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN") {
        return (
            <AppShell>
                <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
                    <h2>Access Denied</h2>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                        This panel is restricted to Admin users only.
                    </p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div style={{ maxWidth: 1100 }}>
                <h1 style={{ marginBottom: "0.5rem" }}>🛡️ Admin Panel</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
                    Platform management, user oversight, and system health
                </p>

                {/* System metrics */}
                <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1.5rem" }}>
                    {SYSTEM_METRICS.map(m => (
                        <div key={m.label} className="stat-card">
                            <div className="stat-label">{m.label}</div>
                            <div className="stat-value" style={{ color: m.color, fontSize: "1.75rem" }}>{m.value}</div>
                        </div>
                    ))}
                </div>

                {/* Compliance banners */}
                <div className="card" style={{ marginBottom: "1.25rem" }}>
                    <h3 style={{ marginBottom: "1rem" }}>🔐 Security & Compliance Status</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                        {[
                            { label: "AES-256 Encryption", status: "Active", ok: true },
                            { label: "TLS 1.3 in Transit", status: "Active", ok: true },
                            { label: "GDPR Compliance", status: "Compliant", ok: true },
                            { label: "FERPA Compliance", status: "Compliant", ok: true },
                            { label: "COPPA Compliance", status: "Configured", ok: true },
                            { label: "Audit Logging", status: "Active", ok: true },
                        ].map(item => (
                            <div key={item.label} style={{
                                padding: "0.75rem 1rem", borderRadius: 10,
                                background: item.ok ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                                border: `1px solid ${item.ok ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                            }}>
                                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: item.ok ? "var(--success)" : "var(--danger)" }}>
                                    {item.ok ? "✅" : "❌"} {item.status}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 3 }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User table */}
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>👥 User Management</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Chronotype</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {USERS_MOCK.map(user => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{user.email}</td>
                                    <td><span className={`badge ${ROLE_BADGE[user.role]}`}>{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</span></td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{user.chronotype}</td>
                                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{user.joined}</td>
                                    <td>
                                        <button className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppShell>
    );
}
