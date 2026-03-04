"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layout/dashboardLayout";
import api from "@/libs/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Server, HardDrive } from "lucide-react";

interface UsageData {
    plan: {
        name: string;
        maxComputeInstances: number | null;
        includedDiskGb: number | null;
    };
    usage: {
        computeInstances: {
            used: number;
            limit: number | null;
            percentage: number | null;
        };
        diskGb: {
            used: number;
            limit: number | null;
            percentage: number | null;
        };
    };
}

function UsageBar({ percentage, label }: { percentage: number | null; label: string }) {
    const pct = percentage ?? 0;
    const color =
        pct > 90 ? "bg-red-500" :
        pct > 70 ? "bg-orange-500" :
        "bg-emerald-500";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{label}</span>
                <span className={`font-medium ${pct > 90 ? "text-red-400" : pct > 70 ? "text-orange-400" : "text-emerald-400"}`}>
                    {percentage !== null ? `${pct}%` : "—"}
                </span>
            </div>
            <div className="h-2 rounded-full bg-neutral-800">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                />
            </div>
        </div>
    );
}

export default function TeamUsagePage() {
    const params = useParams();
    const teamSlug = Array.isArray(params.team_slug)
        ? params.team_slug[0]
        : (params.team_slug as string | undefined);

    const [usageData, setUsageData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!teamSlug) return;
        api().get(`/teams/${teamSlug}/usage`)
            .then(r => setUsageData(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [teamSlug]);

    const plan = usageData?.plan;
    const usage = usageData?.usage;

    return (
        <DashboardLayout className="px-8 py-6 space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-semibold">Usage & Limites</h1>
                <p className="text-sm text-neutral-400 mt-1">
                    Consommation de votre organisation par rapport aux limites du plan.
                </p>
            </div>

            {/* Plan info */}
            <Card>
                <CardHeader>
                    <CardTitle>Plan actuel</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="h-6 w-32 animate-pulse rounded bg-neutral-800" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-semibold text-white">{plan?.name ?? "—"}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium uppercase tracking-wide">
                                Actif
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Usage cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                            <Server className="w-4 h-4 text-indigo-400" />
                        </div>
                        <CardTitle className="text-base">Instances de calcul</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-4 w-full animate-pulse rounded bg-neutral-800" />
                                <div className="h-2 w-full animate-pulse rounded bg-neutral-800" />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold text-white">
                                        {usage?.computeInstances.used ?? 0}
                                    </span>
                                    <span className="text-neutral-500">
                                        / {plan?.maxComputeInstances ?? "∞"}
                                    </span>
                                </div>
                                <UsageBar
                                    percentage={usage?.computeInstances.percentage ?? null}
                                    label={plan?.maxComputeInstances
                                        ? `${usage?.computeInstances.used ?? 0} sur ${plan.maxComputeInstances} instances`
                                        : "Illimité"}
                                />
                                {plan?.maxComputeInstances === null && (
                                    <p className="text-xs text-neutral-500">Illimité sur ce plan</p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                            <HardDrive className="w-4 h-4 text-blue-400" />
                        </div>
                        <CardTitle className="text-base">Espace disque</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-4 w-full animate-pulse rounded bg-neutral-800" />
                                <div className="h-2 w-full animate-pulse rounded bg-neutral-800" />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold text-white">
                                        {(usage?.diskGb.used ?? 0).toFixed(2)}
                                    </span>
                                    <span className="text-neutral-500">
                                        GB / {plan?.includedDiskGb ? `${plan.includedDiskGb} GB` : "∞"}
                                    </span>
                                </div>
                                <UsageBar
                                    percentage={usage?.diskGb.percentage ?? null}
                                    label={plan?.includedDiskGb
                                        ? `${(usage?.diskGb.used ?? 0).toFixed(2)} GB sur ${plan.includedDiskGb} GB inclus`
                                        : "Illimité"}
                                />
                                {plan?.includedDiskGb === null && (
                                    <p className="text-xs text-neutral-500">Illimité sur ce plan</p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs text-neutral-500 pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-2 rounded-full bg-emerald-500" />
                    <span>&lt; 70% — Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-2 rounded-full bg-orange-500" />
                    <span>70–90% — Attention</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-2 rounded-full bg-red-500" />
                    <span>&gt; 90% — Critique</span>
                </div>
            </div>
        </DashboardLayout>
    );
}
