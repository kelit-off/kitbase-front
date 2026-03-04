"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layout/dashboardLayout";
import api from "@/libs/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, Database, Users, HardDrive, RefreshCw } from "lucide-react";

interface ProjectMetrics {
    summary: {
        totalConnections: number;
        activeConnections: number;
        totalDatabases: number;
        totalSizeBytes: number;
    };
    recentQueries: Array<{
        query: string;
        calls: number;
        totalTime: number;
        meanTime: number;
    }>;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function MonitoringPage() {
    const params = useParams();
    const projectSlug = Array.isArray(params.project_slug)
        ? params.project_slug[0]
        : (params.project_slug as string | undefined);

    const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchMetrics = async () => {
        if (!projectSlug) return;
        try {
            const res = await api().get(`/monitoring/metrics/project/${projectSlug}`);
            setMetrics(res.data);
            setLastRefresh(new Date());
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, [projectSlug]);

    const summary = metrics?.summary;
    const queries = metrics?.recentQueries ?? [];

    return (
        <DashboardLayout className="px-8 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Monitoring</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        Rafraîchissement automatique toutes les 30 secondes
                    </p>
                </div>
                <button
                    onClick={fetchMetrics}
                    className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        Mis à jour à {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={<Users className="w-5 h-5 text-indigo-400" />}
                    title="Connexions actives"
                    value={loading ? "—" : String(summary?.activeConnections ?? 0)}
                    sub={`Total : ${summary?.totalConnections ?? 0}`}
                />
                <MetricCard
                    icon={<Activity className="w-5 h-5 text-emerald-400" />}
                    title="Connexions totales"
                    value={loading ? "—" : String(summary?.totalConnections ?? 0)}
                    sub="Depuis le démarrage"
                />
                <MetricCard
                    icon={<Database className="w-5 h-5 text-blue-400" />}
                    title="Bases de données"
                    value={loading ? "—" : String(summary?.totalDatabases ?? 0)}
                    sub="Dans ce projet"
                />
                <MetricCard
                    icon={<HardDrive className="w-5 h-5 text-purple-400" />}
                    title="Taille totale"
                    value={loading ? "—" : formatBytes(summary?.totalSizeBytes ?? 0)}
                    sub="Toutes bases confondues"
                />
            </div>

            {/* Recent queries table */}
            <Card>
                <CardHeader>
                    <CardTitle>Requêtes récentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 rounded bg-neutral-800 animate-pulse" />
                            ))}
                        </div>
                    ) : queries.length === 0 ? (
                        <div className="py-10 text-center text-neutral-500 text-sm">
                            Aucune requête disponible pour ce projet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-800 text-left text-neutral-500">
                                        <th className="pb-3 pr-4 font-medium">Requête</th>
                                        <th className="pb-3 pr-4 font-medium text-right whitespace-nowrap">Appels</th>
                                        <th className="pb-3 pr-4 font-medium text-right whitespace-nowrap">Temps moyen</th>
                                        <th className="pb-3 font-medium text-right whitespace-nowrap">Temps total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/60">
                                    {queries.map((q, i) => (
                                        <tr key={i} className="hover:bg-neutral-900/40 transition-colors">
                                            <td className="py-3 pr-4">
                                                <code className="font-mono text-neutral-300 line-clamp-1 max-w-sm block">
                                                    {q.query}
                                                </code>
                                            </td>
                                            <td className="py-3 pr-4 text-right text-neutral-300 tabular-nums">
                                                {q.calls.toLocaleString()}
                                            </td>
                                            <td className={`py-3 pr-4 text-right tabular-nums font-medium ${
                                                q.meanTime > 1000 ? "text-red-400"
                                                : q.meanTime > 200 ? "text-orange-400"
                                                : "text-emerald-400"
                                            }`}>
                                                {q.meanTime >= 1000
                                                    ? `${(q.meanTime / 1000).toFixed(2)} s`
                                                    : `${q.meanTime.toFixed(1)} ms`}
                                            </td>
                                            <td className="py-3 text-right text-neutral-400 tabular-nums">
                                                {q.totalTime >= 1000
                                                    ? `${(q.totalTime / 1000).toFixed(2)} s`
                                                    : `${q.totalTime.toFixed(0)} ms`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}

function MetricCard({ icon, title, value, sub }: {
    icon: React.ReactNode; title: string; value: string; sub: string;
}) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-[#0f0f0f] p-4 space-y-2">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 w-fit">{icon}</div>
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-sm text-neutral-400">{title}</div>
            <div className="text-xs text-neutral-500">{sub}</div>
        </div>
    );
}
