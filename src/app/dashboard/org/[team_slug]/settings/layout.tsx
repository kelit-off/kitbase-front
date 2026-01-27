"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Settings, Shield } from "lucide-react";
import { cn } from "@/libs/util";
import DashboardLayout from "@/layout/dashboardLayout";

const settingsNav = [
    {
        name: "General",
        href: (teamSlug: string) => `/dashboard/org/${teamSlug}/settings/general`,
        icon: Settings,
    },
    {
        name: "Security",
        href: (teamSlug: string) => `/dashboard/org/${teamSlug}/settings/security`,
        icon: Shield,
    },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();
    const teamSlug = params.team_slug as string;

    return (
        <DashboardLayout>
            <div className="max-w-5xl w-full mx-auto py-10 px-4">
                <h1 className="text-xl font-semibold text-white mb-6">
                    Organization Settings
                </h1>

                <div className="flex gap-8">
                    {/* Sidebar navigation */}
                    <nav className="w-48 shrink-0 space-y-1">
                        {settingsNav.map((item) => {
                            const href = item.href(teamSlug);
                            const isActive = pathname === href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-gray-800 text-white"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
