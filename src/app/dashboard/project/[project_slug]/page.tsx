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
    Copy,
    Eye,
    EyeOff,
    CheckCircle2,
    X,
} from "lucide-react";

type ProjectType = {
    name?: string;
    host?: string;
    port?: number;
    username?: string;
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

    const [metrics, setMetrics] = useState<{
        totalQueries: number;
        activeConnections: number;
        databaseSizeBytes: number;
        recentQuery: []
    } | null>(null);

    const [showConnect, setShowConnect] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [connectTab, setConnectTab] = useState<"string" | "frameworks" | "mobile" | "orm" | "apikeys" | "mcp">("string");
    const [connectType, setConnectType] = useState<"URI" | "JDBC" | "env">("URI");
    const [connectSource, setConnectSource] = useState<"direct" | "pooler">("direct");
    const [showParams, setShowParams] = useState(false);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!projectSlug) return;

            try {
                const response = await api().get(`/monitoring/metrics/project/${projectSlug}`);
                setMetrics(response.data.summary);
            } catch (err) {
                console.error("Erreur lors du chargement des métriques", err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, [projectSlug]);

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 1500);
        } catch {
            // ignore
        }
    };

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

    // Connection info from project
    const connHost = project.host ?? `db-${projectSlug}.kitbase.io`;
    const connPort = project.port ?? 5432;
    const connDb = databases[0]?.name ?? projectSlug ?? "postgres";
    const connUser = project.username ?? "postgres";
    const connPassword = "••••••••••••";
    const connPasswordReal = "[mot de passe du projet]";
    const connString = `postgresql://${connUser}:${connPasswordReal}@${connHost}:${connPort}/${connDb}`;

    return (
        <DashboardLayout className="px-8 py-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold">{project.name}</h1>

                    <Button onClick={() => setShowConnect(true)}>
                        <PlugZap className="w-4 h-4 mr-2" />
                        Connexion
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                    <span>
                        Bases de données{" "}
                        <strong className="text-white">{databases.length}</strong>
                    </span>
                    <span>
                        Instances{" "}
                        <strong className="text-white">{instances.length}</strong>
                    </span>
                    <Badge className="bg-emerald-600 text-white">Opérationnel</Badge>
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
                    title="Instances de calcul"
                    value={instances.length.toString()}
                    hint="CPU / RAM dédiées"
                />
                <StatCard
                    icon={<Activity className="w-5 h-5 text-emerald-400" />}
                    title="Requêtes"
                    value={metrics?.totalQueries?.toLocaleString() ?? "—"}
                    hint={`${metrics?.activeConnections ?? 0} connexions actives`}
                />
                <StatCard
                    icon={<ShieldCheck className="w-5 h-5 text-purple-400" />}
                    title="Sécurité"
                    value="Sauvegardes actives"
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
                        title="Sauvegardes"
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
                        <CardTitle>Instances de calcul</CardTitle>
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
                                        {instance.status === "running" ? "En cours" : instance.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bases de données</CardTitle>
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
                                    <div className="font-medium">{db.name ?? "Base de données"}</div>
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
                        <CardTitle>Santé de la base</CardTitle>
                    </CardHeader>
                    <CardContent className="text-neutral-400 space-y-3">
                        <HealthRow label="Lag de réplication" value="0 ms" />
                        <HealthRow label="Sauvegardes" value="Activé" />
                        <HealthRow label="Récupération PITR" value="Activé" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="border-b border-neutral-800 pb-6">
                        <CardTitle>Requêtes lentes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {metrics?.recentQuery && metrics.recentQuery.length > 0 ? (
                            <>
                                {metrics.recentQuery.map((query, index) => (
                                    <SlowQueryRow
                                        key={`${index}`}
                                        query={query}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground text-sm py-4">
                                Aucune requête récente disponible
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal Connexion — style Supabase */}
            {showConnect && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-[#111] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-start justify-between px-6 pt-5 pb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Connecter à votre projet</h3>
                                <p className="text-sm text-neutral-400 mt-0.5">
                                    Obtenez les chaînes de connexion et variables d'environnement pour votre application.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowConnect(false)}
                                className="p-1.5 rounded-lg hover:bg-neutral-900/60 text-neutral-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 border-b border-neutral-800 overflow-x-auto">
                            <div className="flex gap-0 min-w-max">
                                {([
                                    { id: "string", label: "Chaîne de connexion" },
                                    { id: "frameworks", label: "Frameworks App" },
                                    { id: "mobile", label: "Frameworks Mobile" },
                                    { id: "orm", label: "ORMs" },
                                    { id: "apikeys", label: "Clés API" },
                                    { id: "mcp", label: "MCP" },
                                ] as const).map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setConnectTab(tab.id)}
                                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                            connectTab === tab.id
                                                ? "border-white text-white"
                                                : "border-transparent text-neutral-400 hover:text-neutral-200"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab content */}
                        <div className="px-6 py-5 space-y-5">
                            {connectTab === "string" && (
                                <>
                                    {/* Selectors row */}
                                    <div className="flex flex-wrap gap-3">
                                        {/* Type */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-neutral-500">Type</span>
                                            <div className="flex rounded-lg border border-neutral-700 overflow-hidden text-sm">
                                                {(["URI", "JDBC", ".env"] as const).map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setConnectType(t === ".env" ? "env" : t)}
                                                        className={`px-3 py-1.5 transition-colors ${
                                                            (t === ".env" ? connectType === "env" : connectType === t)
                                                                ? "bg-neutral-700 text-white"
                                                                : "text-neutral-400 hover:text-white"
                                                        }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Source */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-neutral-500">Source</span>
                                            <div className="flex rounded-lg border border-neutral-700 overflow-hidden text-sm">
                                                {([
                                                    { id: "direct", label: "Base principale" },
                                                    { id: "pooler", label: "Pooler" },
                                                ] as const).map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setConnectSource(s.id)}
                                                        className={`px-3 py-1.5 transition-colors ${
                                                            connectSource === s.id
                                                                ? "bg-neutral-700 text-white"
                                                                : "text-neutral-400 hover:text-white"
                                                        }`}
                                                    >
                                                        {s.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connection section */}
                                    <div className="rounded-lg border border-neutral-800 bg-[#0b0b0b] overflow-hidden">
                                        <div className="px-4 py-3 border-b border-neutral-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {connectSource === "direct" ? "Connexion directe" : "Session Pooler"}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 mt-0.5">
                                                        {connectSource === "direct"
                                                            ? "Idéal pour les connexions persistantes (VMs, conteneurs)."
                                                            : "Idéal pour les environnements sans état (serverless, edge)."}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connection string display */}
                                        <div className="px-4 py-3 flex items-center gap-3">
                                            <code className="flex-1 font-mono text-sm text-neutral-300 break-all">
                                                {connectType === "env"
                                                    ? `DATABASE_URL="${connString}"`
                                                    : connectType === "JDBC"
                                                    ? `jdbc:postgresql://${connHost}:${connPort}/${connDb}?user=${connUser}&password=[MOT_DE_PASSE]`
                                                    : connString}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(
                                                    connectType === "env" ? `DATABASE_URL="${connString}"` : connString,
                                                    "connstring"
                                                )}
                                                className="shrink-0 p-1.5 rounded text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                                            >
                                                {copiedField === "connstring"
                                                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    : <Copy className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>

                                        {/* View params toggle */}
                                        <button
                                            onClick={() => setShowParams(!showParams)}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-neutral-400 hover:text-white border-t border-neutral-800 transition-colors hover:bg-neutral-900/40"
                                        >
                                            <span className="text-neutral-500">›</span>
                                            {showParams ? "Masquer les paramètres" : "Voir les paramètres"}
                                        </button>

                                        {/* Params expanded */}
                                        {showParams && (
                                            <div className="border-t border-neutral-800 grid grid-cols-2 gap-px bg-neutral-800">
                                                {[
                                                    { label: "Hôte", value: connHost, key: "host" },
                                                    { label: "Port", value: String(connPort), key: "port" },
                                                    { label: "Base de données", value: connDb, key: "db" },
                                                    { label: "Utilisateur", value: connUser, key: "user" },
                                                ].map((p) => (
                                                    <div key={p.key} className="bg-[#0b0b0b] px-4 py-2.5 flex items-center justify-between gap-2">
                                                        <div>
                                                            <div className="text-xs text-neutral-500">{p.label}</div>
                                                            <div className="font-mono text-sm text-neutral-200 truncate max-w-[180px]">{p.value}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(p.value, p.key)}
                                                            className="text-neutral-600 hover:text-white transition-colors shrink-0"
                                                        >
                                                            {copiedField === p.key
                                                                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                                : <Copy className="w-3.5 h-3.5" />
                                                            }
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Password */}
                                                <div className="bg-[#0b0b0b] px-4 py-2.5 col-span-2 flex items-center justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div className="text-xs text-neutral-500">Mot de passe</div>
                                                        <div className="font-mono text-sm text-neutral-200">
                                                            {showPassword ? connPasswordReal : connPassword}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-neutral-500 hover:text-white transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reset password */}
                                    <p className="text-xs text-neutral-500">
                                        Vous pouvez réinitialiser le mot de passe depuis les{" "}
                                        <span className="text-neutral-300 underline cursor-pointer">
                                            paramètres de la base de données
                                        </span>.
                                    </p>
                                </>
                            )}

                            {connectTab !== "string" && (
                                <div className="py-10 text-center text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-lg">
                                    Bientôt disponible
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
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

function SlowQueryRow({ query, duration, calls }: { query: string; duration?: string; calls?: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-neutral-200 truncate pr-4">{query}</span>
            {(duration || calls) && (
                <span className="text-neutral-400">
                    {duration && <>{duration}</>}
                    {duration && calls && <> · </>}
                    {calls && <>{calls} appels</>}
                </span>
            )}
        </div>
    );
}
