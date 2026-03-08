"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/layout/dashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/libs/api";
import {
    Plus,
    Search,
    Table as TableIcon,
    Filter,
    Rows3,
    ChevronRight,
    X,
    Pencil,
    Trash2,
    RefreshCw,
} from "lucide-react";

type ApiTable = {
    table_name: string;
    table_type: string;
    size_bytes: string;
    size_pretty: string;
    row_estimate: string;
};

export default function TableManagerPage() {
    const params = useParams();
    const projectSlugParam = params.project_slug;
    const projectSlug = Array.isArray(projectSlugParam)
        ? projectSlugParam[0]
        : (projectSlugParam as string | undefined);

    const [tables, setTables] = useState<ApiTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<ApiTable | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showInsert, setShowInsert] = useState(false);

    const fetchTables = async () => {
        if (!projectSlug) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api().get(`/projects/${projectSlug}/tables`);
            const data: ApiTable[] = response.data;
            setTables(data);
            if (data.length > 0 && !selected) {
                setSelected(data[0]);
            }
        } catch {
            setError("Impossible de charger les tables.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectSlug]);

    const filteredTables = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return tables;
        return tables.filter((t) => t.table_name.toLowerCase().includes(q));
    }, [query, tables]);

    return (
        <DashboardLayout className="px-8 py-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Éditeur de tables</h1>
                        <p className="text-sm text-neutral-400">
                            Projet:{" "}
                            <span className="text-neutral-200 font-medium">
                                {projectSlug ?? "—"}
                            </span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={fetchTables} disabled={loading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                            Actualiser
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle table
                        </Button>
                        <Button size="sm" onClick={() => setShowInsert(true)} disabled={!selected}>
                            <Plus className="w-4 h-4 mr-2" />
                            Insérer une ligne
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-900 bg-red-950/50 text-red-200 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: tables list */}
                    <Card className="lg:col-span-4 border-neutral-800 bg-[#0f0f0f]">
                        <CardHeader className="gap-3">
                            <CardTitle className="flex items-center gap-2">
                                <TableIcon className="w-5 h-5 text-indigo-400" />
                                Tables
                                {!loading && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {tables.length}
                                    </Badge>
                                )}
                            </CardTitle>
                            <div className="relative">
                                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Rechercher une table…"
                                    className="pl-9 bg-[#0b0b0b] border-neutral-800"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {loading && (
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-16 rounded-lg bg-neutral-900 animate-pulse" />
                                    ))}
                                </div>
                            )}

                            {!loading && filteredTables.map((t) => {
                                const active = selected?.table_name === t.table_name;
                                return (
                                    <button
                                        key={t.table_name}
                                        onClick={() => setSelected(t)}
                                        className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${active
                                            ? "border-indigo-500/60 bg-indigo-500/10"
                                            : "border-neutral-800 bg-[#0b0b0b] hover:border-neutral-700"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-neutral-200">
                                                        {t.table_name}
                                                    </span>
                                                    {active && (
                                                        <Badge className="bg-indigo-600 text-white">
                                                            Sélectionné
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-neutral-500">
                                                    ~{Number(t.row_estimate).toLocaleString()} lignes • {t.size_pretty}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-500 mt-1" />
                                        </div>
                                    </button>
                                );
                            })}

                            {!loading && filteredTables.length === 0 && (
                                <div className="text-sm text-neutral-500 text-center py-10 border border-dashed border-neutral-800 rounded-lg bg-[#0b0b0b]">
                                    Aucune table trouvée.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right: selected table */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {selected ? (
                            <Card className="border-neutral-800 bg-[#0f0f0f]">
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">
                                            {selected.table_name}
                                        </CardTitle>
                                        <div className="text-xs text-neutral-500">
                                            {selected.table_type} • {selected.size_pretty} • ~{Number(selected.row_estimate).toLocaleString()} lignes
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button size="sm" variant="outline">
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Modifier le schéma
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Filter className="w-4 h-4 mr-2" />
                                            Filtres
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Supprimer
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                            <Rows3 className="w-4 h-4 text-neutral-400" />
                                            Aperçu des données
                                        </div>
                                        <div className="rounded-lg border border-dashed border-neutral-800 bg-[#0b0b0b] p-8 text-sm text-neutral-500 text-center">
                                            Sélectionnez "Filtres" pour parcourir les données de cette table.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            !loading && (
                                <Card className="border-neutral-800 bg-[#0f0f0f]">
                                    <CardContent className="flex items-center justify-center py-20 text-sm text-neutral-500">
                                        Sélectionnez une table pour voir ses détails.
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Create table modal (UI only) */}
            {showCreate && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-[#111]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <div className="space-y-1">
                                <div className="text-lg font-semibold">Nouvelle table</div>
                                <div className="text-sm text-neutral-400">
                                    Crée une table (UI seulement).
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreate(false)}
                                className="p-2 rounded-lg hover:bg-neutral-900/60"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Nom</div>
                                <Input
                                    placeholder="ex: invoices"
                                    className="bg-[#0b0b0b] border-neutral-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Colonnes</div>
                                <div className="rounded-lg border border-neutral-800 bg-[#0b0b0b] p-4 text-sm text-neutral-500">
                                    Builder de colonnes à brancher (type, contraintes, index, RLS…)
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreate(false)}>
                                Annuler
                            </Button>
                            <Button onClick={() => setShowCreate(false)}>Créer</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Insert row modal (UI only) */}
            {showInsert && selected && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-[#111]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <div className="space-y-1">
                                <div className="text-lg font-semibold">Insérer une ligne</div>
                                <div className="text-sm text-neutral-400">
                                    Table:{" "}
                                    <span className="text-neutral-200 font-medium">{selected.table_name}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowInsert(false)}
                                className="p-2 rounded-lg hover:bg-neutral-900/60"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="rounded-lg border border-neutral-800 bg-[#0b0b0b] p-4 text-sm text-neutral-500">
                                Formulaire dynamique selon colonnes (UI seulement pour l'instant).
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowInsert(false)}>
                                Annuler
                            </Button>
                            <Button onClick={() => setShowInsert(false)}>Insérer</Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
