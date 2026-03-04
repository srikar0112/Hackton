"use client";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="main-layout">
            <Sidebar />
            <main className="page-content">
                {children}
            </main>
        </div>
    );
}
