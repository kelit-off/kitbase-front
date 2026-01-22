"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/hooks/useProject";
import DashboardLayout from "@/layout/dashboardLayout";
import api from "@/libs/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Database,
    HardDrive,
    Activity,
    ShieldCheck,
    ArrowUpRight,
    Wrench,
    Table,
    PlugZap,
} from "lucide-react";

type ProjectType = {
    name?: string;
    databases?: Array<{
        id?: string;
        name?: string;
        databasePlan?: { name?: string };
    }>;
    computerInstances?: Array<{
        id: string;
        name?: string;
        status: string;
        computerPlan: {
            code: string;
            name: string;
            cpuCores: number;
            memoryMb: number;
        };
    }>;
};

export default function ProjectDahsboardPage() {
    const params = useParams();
    const projectSlugParam = params.project_slug;
    const teamSlugParam = params.team_slug;
    const projectSlug = Array.isArray(projectSlugParam)
        ? projectSlugParam[0]
        : (projectSlugParam as string | undefined);
    const teamSlug = Array.isArray(teamSlugParam)
        ? teamSlugParam[0]
        : (teamSlugParam as string | undefined);

    const { data, isLoading } = useProject({ projectSlug, teamSlug } as any);
    const project = (Array.isArray(data) ? data[0] : data) as ProjectType | undefined;

    const [metrics, setMetrics] = useState<any>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api().get("/monitoring/metrics/json");
                setMetrics(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des métriques", err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <DashboardLayout className="px-8 py-6 space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-28 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    if (!project) {
        return (
            <DashboardLayout className="px-8 py-6">
                <Card className="border-red-900 bg-red-950/50 text-red-100">
                    <CardHeader>
                        <CardTitle>Projet introuvable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-200">
                            Le projet demandé n'existe pas ou n'est pas accessible.
                        </p>
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    const databases = project.databases ?? [];
    const instances = project.computerInstances ?? [];

    return (
        <DashboardLayout className="px-8 py-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold">{project.name}</h1>

                    {instances.map((instance) => (
                        <Badge key={instance.id} variant="secondary">
                            {instance.name ?? "Instance"} · {instance.computerPlan.code.toUpperCase()}
                        </Badge>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                    <span>
                        Databases{" "}
                        <strong className="text-white">{databases.length}</strong>
                    </span>
                    <span>
                        Instances{" "}
                        <strong className="text-white">{instances.length}</strong>
                    </span>
                    <Badge className="bg-emerald-600 text-white">Healthy</Badge>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<Database className="w-5 h-5 text-indigo-400" />}
                    title="Bases de données"
                    value={databases.length.toString()}
                    hint="Actives dans ce projet"
                />
                <StatCard
                    icon={<HardDrive className="w-5 h-5 text-blue-400" />}
                    title="Instances compute"
                    value={instances.length.toString()}
                    hint="CPU / RAM dédiées"
                />
                <StatCard
                    icon={<Activity className="w-5 h-5 text-emerald-400" />}
                    title="Requêtes / jour"
                    value={metrics?.totalQueries?.toLocaleString() ?? "—"}
                    hint="Données de monitoring"
                />
                <StatCard
                    icon={<ShieldCheck className="w-5 h-5 text-purple-400" />}
                    title="Sécurité"
                    value="Backups actifs"
                    hint="Chiffrement & PITR"
                />
            </div>

            {/* Actions rapides */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Accès rapide</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            as={Link}
                            href={`/dashboard/project/${String(projectSlug ?? "")}/database/sql`}
                            size="sm"
                            variant="outline"
                        >
                            <PlugZap className="w-4 h-4 mr-2" />
                            Ouvrir SQL Editor
                        </Button>
                        <Button
                            as={Link}
                            href={`/dashboard/project/${String(projectSlug ?? "")}/database/tables`}
                            size="sm"
                        >
                            <Table className="w-4 h-4 mr-2" />
                            Gérer les tables
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <ActionLink
                        title="Paramètres projet"
                        description="Domaines, API keys, webhooks"
                        href={`/dashboard/project/${String(projectSlug ?? "")}/database/sql`}
                        icon={<Wrench className="w-4 h-4 text-indigo-400" />}
                    />
                    <ActionLink
                        title="Monitoring"
                        description="Performance, temps de réponse"
                        href={`/dashboard/project/${String(projectSlug ?? "")}/database/sql`}
                        icon={<Activity className="w-4 h-4 text-emerald-400" />}
                    />
                    <ActionLink
                        title="Backups"
                        description="Snapshots, restauration"
                        href={`/dashboard/project/${String(projectSlug ?? "")}/database/sql`}
                        icon={<HardDrive className="w-4 h-4 text-blue-400" />}
                    />
                </CardContent>
            </Card>

            {/* Instances & bases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Compute Instances</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {instances.length === 0 && (
                            <p className="text-sm text-neutral-500">
                                Aucune instance configurée pour l'instant.
                            </p>
                        )}
                        {instances.map((instance) => (
                            <div
                                key={instance.id}
                                className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
                            >
                                <div>
                                    <div className="font-medium">{instance.name}</div>
                                    <div className="text-sm text-neutral-400">
                                        {instance.computerPlan.cpuCores} vCPU · {instance.computerPlan.memoryMb} MB RAM
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary">{instance.computerPlan.name}</Badge>
                                    <Badge
                                        className={
                                            instance.status === "running"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-yellow-600 text-white"
                                        }
                                    >
                                        {instance.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Databases</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {databases.length === 0 && (
                            <p className="text-sm text-neutral-500">
                                Aucune base créée pour ce projet.
                            </p>
                        )}

                        {databases.map((db) => (
                            <div
                                key={db.id ?? db.name}
                                className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
                            >
                                <div>
                                    <div className="font-medium">{db.name ?? "Database"}</div>
                                    <div className="text-sm text-neutral-400">
                                        Plan : {db.databasePlan?.name ?? "N/A"}
                                    </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-2">
                                    <ArrowUpRight className="w-4 h-4" />
                                    Ouvrir
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Santé & requêtes lentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Database Health</CardTitle>
                    </CardHeader>
                    <CardContent className="text-neutral-400 space-y-3">
                        <HealthRow label="Replication lag" value="0 ms" />
                        <HealthRow label="Backups" value="Enabled" />
                        <HealthRow label="Point-in-time recovery" value="Enabled" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="border-b border-neutral-800 pb-6">
                        <CardTitle>Slow Queries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <SlowQueryRow
                            query="SELECT name FROM pg_timezone_names"
                            duration="0.15s"
                            calls="61"
                        />
                        <SlowQueryRow query="SELECT * FROM users WHERE active = true" duration="0.09s" calls="34" />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function StatCard({
    icon,
    title,
    value,
    hint,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-[#0f0f0f] p-4 space-y-2">
            <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">{icon}</div>
            </div>
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-sm text-neutral-400">{title}</div>
            <div className="text-xs text-neutral-500">{hint}</div>
        </div>
    );
}

function ActionLink({
    title,
    description,
    href,
    icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-start gap-3 rounded-lg border border-neutral-800 bg-[#0b0b0b] px-4 py-3 hover:border-indigo-500/60 transition-colors"
        >
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800">{icon}</div>
            <div className="space-y-1">
                <div className="font-medium text-white flex items-center gap-2">
                    {title}
                </div>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 ml-auto" />
        </Link>
    );
}

function HealthRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span>{label}</span>
            <span className="text-white">{value}</span>
        </div>
    );
}

function SlowQueryRow({ query, duration, calls }: { query: string; duration: string; calls: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-neutral-200 truncate pr-4">{query}</span>
            <span className="text-neutral-400">
                {duration} · {calls} calls
            </span>
        </div>
    );
}