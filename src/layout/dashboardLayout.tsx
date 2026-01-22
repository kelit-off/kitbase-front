"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
	Database,
	Table,
	Code,
	Settings,
	BarChart3,
	Key,
	HardDrive,
	Users,
	Menu,
	X,
	ChevronRight,
	LayoutDashboard,
	FolderOpen,
	Calculator,
} from "lucide-react";
import { cn } from "@/libs/util";
import QueryProvider from "@/libs/QueryProvider";

interface NavItem {
	name: string;
	href?: string | ((params: { teamSlug?: string; projectSlug?: string }) => string);
	icon?: React.ElementType;
	requiresTeam?: boolean;
	requiresProject?: boolean;
}


const navigation: NavItem[] = [
	// Navigation Organisation
	{
		name: "Vue d'ensemble",
		href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}` : "/dashboard/"),
		icon: LayoutDashboard,
		requiresTeam: true,
	},
	{
		name: "Team",
		href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/team` : "/dashboard/"),
		icon: Users,
		requiresTeam: true,
	},
	{
		name: "Usage",
		href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/usage` : "/dashboard/"),
		icon: BarChart3,
		requiresTeam: true,
	},
	{
		name: "Billing",
		href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/billing` : "/dashboard/"),
		icon: Calculator,
		requiresTeam: true,
	},
	{
		name: "Organizations settings",
		href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/general` : "/dashboard/"),
		icon: Settings,
		requiresTeam: true,
	},
	// Navigation Projet
	{
		name: "Vue d'ensemble",
		href: ({ projectSlug }) => `/dashboard/project/${projectSlug}`,
		icon: FolderOpen,
		requiresProject: true,
	},
	{
		name: "Tables",
		href: ({ projectSlug }) => `/dashboard/project/${projectSlug}/database/tables`,
		icon: Table,
		requiresProject: true,
	},
	{
		name: "SQL Editor",
		href: ({ projectSlug }) => `/dashboard/project/${projectSlug}/database/sql`,
		icon: Code,
		requiresProject: true,
	},
];


export default function DashboardLayout({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const pathname = usePathname();
	const params = useParams();

	const teamSlug = params.team_slug as string | undefined;
	const projectSlug = params.project_slug as string | undefined;

	// Vérifier si le pathname correspond à une route (exacte ou parente)
	const normalizePath = (path: string) =>
		path.replace(/\/+$/, ""); // supprime les slashs finaux

	const isActive = (href: string) => {
		return pathname.replace(/\/+$/, "") === href.replace(/\/+$/, "");
	};

	const [showSidebar, setShowSidebar] = useState(false);
	useEffect(() => {
		setShowSidebar(!!teamSlug || !!projectSlug);
	}, [teamSlug, projectSlug]);

	return (
		<QueryProvider>
			<div className="flex h-screen flex-col bg-[#0a0a0a] text-white overflow-hidden">
				{/* ================= Header global ================= */}
				<header className="h-16 w-full border-b border-gray-800 bg-[#0f0f0f] flex items-center px-6">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-4">
							<Link
								href="/dashboard"
								className="text-lg font-semibold hover:text-indigo-400 transition-colors"
							>
								Dashboard
							</Link>

							{/* {showSidebar && (
								<button
									onClick={() => setSidebarOpen(!sidebarOpen)}
									className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
								>
									{sidebarOpen ? (
										<X className="w-5 h-5" />
									) : (
										<Menu className="w-5 h-5" />
									)}
								</button>
							)} */}
						</div>

						<div className="flex items-center gap-4 text-sm text-gray-400">
							<span className="hidden sm:inline">Base de données active</span>
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
						</div>
					</div>
				</header>

				{/* ================= Body ================= */}
				<div className="flex flex-1 overflow-hidden">
					{/* Sidebar */}
					{showSidebar && (
						<aside
							className={cn(
								"bg-[#111] border-r border-gray-800 transition-all duration-300 flex flex-col w-20 group hover:w-64",
								// sidebarOpen ? "w-64" : "w-20"
							)}
						>
							{/* Navigation */}
							<nav className="flex-1 p-4 space-y-1">
								{navigation.map((item) => {
									const href =
										typeof item.href === "function"
											? item.href({
												teamSlug,
												projectSlug,
											})
											: item.href;

									// Skip si requis mais non dispo
									if (item.requiresTeam && !teamSlug) return null;
									if (item.requiresProject && !projectSlug) return null;
									if (!href || !item.icon) return null;

									const active = isActive(href);
									const Icon = item.icon;

									return (
										<Link
											key={item.name}
											href={href}
											className={cn(
												"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
												active
													? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
													: "text-gray-400 hover:text-white hover:bg-gray-800"
											)}
										>
											<Icon className="w-5 h-5 shrink-0" />

											<span
												className="
													flex-1 whitespace-nowrap overflow-hidden
													opacity-0 w-0
													transition-all duration-300
													group-hover:opacity-100 group-hover:w-auto
													"
											>
												{item.name}
											</span>

											<ChevronRight
												className={cn(
													"w-4 h-4 shrink-0 transition-opacity duration-300",
													active ? "opacity-0 group-hover:opacity-100" : "opacity-0"
												)}
											/>
										</Link>

									);
								})}
							</nav>

							{/* Footer sidebar */}
							{/* <div className="border-t border-gray-800 p-4">
								<div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
									{sidebarOpen && <span>Connecté</span>}
								</div>
							</div> */}
						</aside>
					)}

					{/* Main content */}
					<main className="flex-1 overflow-y-auto">
						<div className={cn("h-full", className)}>{children}</div>
					</main>
				</div>
			</div>
		</QueryProvider>
	);
}

