"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/layout/dashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    Table as TableIcon,
    Filter,
    Columns3,
    Rows3,
    ChevronRight,
    X,
    Pencil,
    Trash2,
    Copy,
    CheckCircle2,
} from "lucide-react";

type TableMeta = {
    name: string;
    rows: number;
    size: string;
    updatedAt: string;
    columns: Array<{ name: string; type: string; pk?: boolean; nullable?: boolean }>;
};

const mockTables: TableMeta[] = [
    {
        name: "users",
        rows: 1250,
        size: "1.2 MB",
        updatedAt: "Il y a 2h",
        columns: [
            { name: "id", type: "uuid", pk: true },
            { name: "email", type: "text" },
            { name: "created_at", type: "timestamptz" },
        ],
    },
    {
        name: "projects",
        rows: 64,
        size: "220 KB",
        updatedAt: "Il y a 5h",
        columns: [
            { name: "id", type: "uuid", pk: true },
            { name: "name", type: "text" },
            { name: "team_id", type: "uuid" },
        ],
    },
    {
        name: "databases",
        rows: 12,
        size: "48 KB",
        updatedAt: "Il y a 1j",
        columns: [
            { name: "id", type: "uuid", pk: true },
            { name: "name", type: "text" },
            { name: "project_id", type: "uuid" },
        ],
    },
];

function makeMockRows(table: TableMeta) {
    if (table.name === "users") {
        return [
            { id: "8d0f…d2b3", email: "john@example.com", created_at: "2024-01-15" },
            { id: "2a1b…9f10", email: "jane@example.com", created_at: "2024-01-15" },
            { id: "1c2d…3e4f", email: "bob@example.com", created_at: "2024-01-14" },
        ];
    }
    if (table.name === "projects") {
        return [
            { id: "a1", name: "kitbase", team_id: "team_01" },
            { id: "b2", name: "demo", team_id: "team_01" },
        ];
    }
    return [{ id: "db1", name: "main", project_id: "proj_01" }];
}

export default function TableManagerPage() {
    const params = useParams();
    const projectSlugParam = params.project_slug;
    const projectSlug = Array.isArray(projectSlugParam)
        ? projectSlugParam[0]
        : (projectSlugParam as string | undefined);

    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<TableMeta>(mockTables[0]);
    const [showCreate, setShowCreate] = useState(false);
    const [showInsert, setShowInsert] = useState(false);
    const [copied, setCopied] = useState(false);

    const tables = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return mockTables;
        return mockTables.filter((t) => t.name.toLowerCase().includes(q));
    }, [query]);

    const rows = useMemo(() => makeMockRows(selected), [selected]);

    const copyCreateSql = async () => {
        const ddl = `create table ${selected.name} (\n${selected.columns
            .map((c) => `  ${c.name} ${c.type}${c.pk ? " primary key" : ""}`)
            .join(",\n")}\n);`;
        try {
            await navigator.clipboard.writeText(ddl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    };

    return (
        <DashboardLayout className="px-8 py-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Table Editor</h1>
                        <p className="text-sm text-neutral-400">
                            Projet:{" "}
                            <span className="text-neutral-200 font-medium">
                                {projectSlug ?? "—"}
                            </span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New table
                        </Button>
                        <Button size="sm" onClick={() => setShowInsert(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Insert row
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: tables list */}
                    <Card className="lg:col-span-4 border-neutral-800 bg-[#0f0f0f]">
                        <CardHeader className="gap-3">
                            <CardTitle className="flex items-center gap-2">
                                <TableIcon className="w-5 h-5 text-indigo-400" />
                                Tables
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
                            {tables.map((t) => {
                                const active = t.name === selected.name;
                                return (
                                    <button
                                        key={t.name}
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
                                                        {t.name}
                                                    </span>
                                                    {active && (
                                                        <Badge className="bg-indigo-600 text-white">
                                                            Selected
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-neutral-500">
                                                    {t.rows.toLocaleString()} rows • {t.size}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-500 mt-1" />
                                        </div>
                                    </button>
                                );
                            })}

                            {tables.length === 0 && (
                                <div className="text-sm text-neutral-500 text-center py-10 border border-dashed border-neutral-800 rounded-lg bg-[#0b0b0b]">
                                    Aucune table trouvée.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right: selected table */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <Card className="border-neutral-800 bg-[#0f0f0f]">
                            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">
                                        {selected.name}
                                    </CardTitle>
                                    <div className="text-xs text-neutral-500">
                                        Dernière modification: {selected.updatedAt}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={copyCreateSql}>
                                        {copied ? (
                                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy DDL
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit schema
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filters
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Drop
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="gap-6">
                                {/* Columns */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                            <Columns3 className="w-4 h-4 text-neutral-400" />
                                            Columns
                                        </div>
                                        <Badge variant="secondary">
                                            {selected.columns.length}
                                        </Badge>
                                    </div>

                                    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#0b0b0b]">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-[#111] border-b border-neutral-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                                                        Name
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                                                        Type
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                                                        Constraints
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selected.columns.map((c) => (
                                                    <tr
                                                        key={c.name}
                                                        className="border-b border-neutral-800 hover:bg-neutral-900/40"
                                                    >
                                                        <td className="px-4 py-2 font-mono text-neutral-200">
                                                            {c.name}
                                                        </td>
                                                        <td className="px-4 py-2 text-neutral-300">
                                                            {c.type}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <div className="flex gap-2">
                                                                {c.pk && (
                                                                    <Badge className="bg-indigo-600 text-white">
                                                                        PK
                                                                    </Badge>
                                                                )}
                                                                {c.nullable === false && (
                                                                    <Badge variant="secondary">
                                                                        NOT NULL
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Rows */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                                            <Rows3 className="w-4 h-4 text-neutral-400" />
                                            Rows (preview)
                                        </div>
                                        <Badge variant="secondary">{rows.length}</Badge>
                                    </div>

                                    <div className="overflow-auto rounded-lg border border-neutral-800 bg-[#0b0b0b]">
                                        <table className="min-w-full text-sm">
                                            <thead className="sticky top-0 bg-[#111] border-b border-neutral-800">
                                                <tr>
                                                    {selected.columns.map((c) => (
                                                        <th
                                                            key={c.name}
                                                            className="px-4 py-3 text-left text-xs font-medium text-neutral-400"
                                                        >
                                                            {c.name}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((r, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="border-b border-neutral-800 hover:bg-neutral-900/40"
                                                    >
                                                        {selected.columns.map((c) => (
                                                            <td
                                                                key={c.name}
                                                                className="px-4 py-2 text-neutral-200"
                                                            >
                                                                {String((r as any)[c.name] ?? "")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Create table modal (UI only) */}
            {showCreate && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-[#111]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <div className="space-y-1">
                                <div className="text-lg font-semibold">New table</div>
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
                                Cancel
                            </Button>
                            <Button onClick={() => setShowCreate(false)}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Insert row modal (UI only) */}
            {showInsert && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-[#111]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <div className="space-y-1">
                                <div className="text-lg font-semibold">Insert row</div>
                                <div className="text-sm text-neutral-400">
                                    Table:{" "}
                                    <span className="text-neutral-200 font-medium">{selected.name}</span>
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
                                Formulaire dynamique selon colonnes (UI seulement pour l’instant).
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowInsert(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setShowInsert(false)}>Insert</Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

