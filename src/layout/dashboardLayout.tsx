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
	PanelLeftClose,
	PanelLeftOpen,
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

interface NavSection {
	label: string;
	requiresTeam?: boolean;
	requiresProject?: boolean;
	items: NavItem[];
}

const navSections: NavSection[] = [
	{
		label: "Organisation",
		requiresTeam: true,
		items: [
			{
				name: "Vue d'ensemble",
				href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}` : "/dashboard/"),
				icon: LayoutDashboard,
				requiresTeam: true,
			},
			{
				name: "Équipe",
				href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/team` : "/dashboard/"),
				icon: Users,
				requiresTeam: true,
			},
			{
				name: "Utilisation",
				href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/usage` : "/dashboard/"),
				icon: BarChart3,
				requiresTeam: true,
			},
			{
				name: "Facturation",
				href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/billing` : "/dashboard/"),
				icon: Calculator,
				requiresTeam: true,
			},
			{
				name: "Paramètres",
				href: ({ teamSlug }) => (teamSlug ? `/dashboard/org/${teamSlug}/settings/general` : "/dashboard/"),
				icon: Settings,
				requiresTeam: true,
			},
		],
	},
	{
		label: "Projet",
		requiresProject: true,
		items: [
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
				name: "Éditeur SQL",
				href: ({ projectSlug }) => `/dashboard/project/${projectSlug}/database/sql`,
				icon: Code,
				requiresProject: true,
			},
			{
				name: "Monitoring",
				href: ({ projectSlug }) => `/dashboard/project/${projectSlug}/monitoring`,
				icon: BarChart3,
				requiresProject: true,
			},
			{
				name: "Paramètres",
				href: ({ projectSlug }) => `/dashboard/project/${projectSlug}/settings`,
				icon: Settings,
				requiresProject: true,
			},
		],
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
				<header className="h-16 w-full border-b border-neutral-800 bg-[#0f0f0f] flex items-center px-6">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-4">
							<Link
								href="/dashboard"
								className="text-lg font-semibold hover:text-indigo-400 transition-colors"
							>
								Kitbase
							</Link>
							<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
								Bêta
							</span>
						</div>

						{showSidebar && (
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
								title={sidebarOpen ? "Réduire la sidebar" : "Étendre la sidebar"}
							>
								{sidebarOpen ? (
									<PanelLeftClose className="w-5 h-5" />
								) : (
									<PanelLeftOpen className="w-5 h-5" />
								)}
							</button>
						)}
					</div>
				</header>

				{/* ================= Body ================= */}
				<div className="flex flex-1 overflow-hidden">
					{/* Sidebar */}
					{showSidebar && (
						<aside
							className={cn(
								"bg-[#111] border-r border-neutral-800 transition-all duration-300 flex flex-col overflow-hidden",
								sidebarOpen ? "w-56" : "w-[60px]"
							)}
						>
							{/* Navigation */}
							<nav className="flex-1 p-3 space-y-4 overflow-y-auto overflow-x-hidden">
								{navSections.map((section) => {
									// Skip section if its context is not available
									if (section.requiresTeam && !teamSlug) return null;
									if (section.requiresProject && !projectSlug) return null;

									const visibleItems = section.items.filter((item) => {
										if (item.requiresTeam && !teamSlug) return false;
										if (item.requiresProject && !projectSlug) return false;
										return !!item.icon;
									});

									if (visibleItems.length === 0) return null;

									return (
										<div key={section.label}>
											<p
												className="px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-500 overflow-hidden transition-all duration-300"
												style={{
													maxHeight: sidebarOpen ? "24px" : "0px",
													opacity: sidebarOpen ? 1 : 0,
													marginBottom: sidebarOpen ? "6px" : "0px",
												}}
											>
												{section.label}
											</p>
											<div className="space-y-0.5">
												{visibleItems.map((item) => {
													const href =
														typeof item.href === "function"
															? item.href({ teamSlug, projectSlug })
															: item.href;

													if (!href) return null;

													const active = isActive(href);
													const Icon = item.icon!;

													return (
														<Link
															key={item.name}
															href={href}
															title={!sidebarOpen ? item.name : undefined}
															className={cn(
																"flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
																sidebarOpen ? "gap-3 justify-start" : "gap-0 justify-center",
																active
																	? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
																	: "text-neutral-400 hover:text-white hover:bg-neutral-800"
															)}
														>
															<Icon className="w-4 h-4 shrink-0" />
															<span
																className="whitespace-nowrap overflow-hidden text-ellipsis transition-[opacity,max-width] duration-200"
																style={{
																	maxWidth: sidebarOpen ? "200px" : "0px",
																	opacity: sidebarOpen ? 1 : 0,
																}}
															>
																{item.name}
															</span>
														</Link>
													);
												})}
											</div>
										</div>
									);
								})}
							</nav>
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

