"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/layout/dashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Save,
    History,
    Search,
    Database,
    Table,
    ChevronDown,
    Copy,
    CheckCircle2,
} from "lucide-react";

type SchemaTable = {
    name: string;
    columns: Array<{ name: string; type: string; nullable?: boolean }>;
};

type QueryResult = {
    columns: string[];
    rows: Array<Record<string, string | number | boolean | null>>;
    elapsedMs: number;
};

const mockSchema: SchemaTable[] = [
    {
        name: "users",
        columns: [
            { name: "id", type: "uuid" },
            { name: "email", type: "text" },
            { name: "created_at", type: "timestamptz" },
        ],
    },
    {
        name: "projects",
        columns: [
            { name: "id", type: "uuid" },
            { name: "name", type: "text" },
            { name: "team_id", type: "uuid" },
        ],
    },
    {
        name: "databases",
        columns: [
            { name: "id", type: "uuid" },
            { name: "name", type: "text" },
            { name: "project_id", type: "uuid" },
        ],
    },
];

const savedQueriesSeed = [
    {
        name: "Lister les utilisateurs",
        sql: "select id, email, created_at from users order by created_at desc limit 50;",
    },
    {
        name: "Projets par team",
        sql: "select team_id, count(*) as projects from projects group by team_id order by projects desc;",
    },
];

export default function SqlEditorPage() {
    const params = useParams();
    const projectSlugParam = params.project_slug;
    const projectSlug = Array.isArray(projectSlugParam)
        ? projectSlugParam[0]
        : (projectSlugParam as string | undefined);

    const [sql, setSql] = useState(savedQueriesSeed[0].sql);
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState<QueryResult | null>(null);
    const [schemaQuery, setSchemaQuery] = useState("");
    const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(
        () =>
            Object.fromEntries(mockSchema.map((t) => [t.name, t.name === "users"]))
    );
    const [history, setHistory] = useState<Array<{ sql: string; at: string }>>(
        []
    );
    const [savedQueries, setSavedQueries] = useState(savedQueriesSeed);
    const [copied, setCopied] = useState(false);

    const filteredSchema = useMemo(() => {
        const q = schemaQuery.trim().toLowerCase();
        if (!q) return mockSchema;
        return mockSchema.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.columns.some((c) => c.name.toLowerCase().includes(q))
        );
    }, [schemaQuery]);

    const run = async () => {
        const trimmed = sql.trim();
        if (!trimmed) return;
        setExecuting(true);

        // UI-only mock: simule exécution + résultats
        setTimeout(() => {
            const now = new Date().toLocaleString();
            setHistory((h) => [{ sql: trimmed, at: now }, ...h].slice(0, 25));

            const fake: QueryResult = {
                columns: ["id", "email", "created_at"],
                rows: [
                    {
                        id: "8d0f…d2b3",
                        email: "john@example.com",
                        created_at: "2024-01-15 12:00:00+00",
                    },
                    {
                        id: "2a1b…9f10",
                        email: "jane@example.com",
                        created_at: "2024-01-15 11:40:00+00",
                    },
                    {
                        id: "1c2d…3e4f",
                        email: "bob@example.com",
                        created_at: "2024-01-14 09:22:00+00",
                    },
                ],
                elapsedMs: 12.8,
            };

            setResult(fake);
            setExecuting(false);
        }, 650);
    };

    const saveCurrent = () => {
        const name = prompt("Nom de la requête sauvegardée ?");
        if (!name) return;
        setSavedQueries((prev) => [{ name, sql }, ...prev]);
    };

    const copySql = async () => {
        try {
            await navigator.clipboard.writeText(sql);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    };

    return (
        <DashboardLayout className="px-8 py-6">
            <div className="flex flex-col gap-6 h-full">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">SQL Editor</h1>
                        <p className="text-sm text-neutral-400">
                            Projet:{" "}
                            <span className="text-neutral-200 font-medium">
                                {projectSlug ?? "—"}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            onClick={run}
                            disabled={executing}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            {executing ? "Exécution..." : "Run"}
                        </Button>
                        <Button onClick={saveCurrent} size="sm" variant="outline">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                        <Button onClick={copySql} size="sm" variant="outline">
                            {copied ? (
                                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                            ) : (
                                <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[70vh]">
                    {/* Sidebar schema */}
                    <Card className="lg:col-span-3 border-neutral-800 bg-[#0f0f0f]">
                        <CardHeader className="gap-3">
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-400" />
                                Schema
                            </CardTitle>
                            <div className="relative">
                                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={schemaQuery}
                                    onChange={(e) => setSchemaQuery(e.target.value)}
                                    placeholder="Rechercher table/colonne…"
                                    className="pl-9 bg-[#0b0b0b] border-neutral-800"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="gap-2">
                            {filteredSchema.map((t) => {
                                const open = !!expandedTables[t.name];
                                return (
                                    <div
                                        key={t.name}
                                        className="rounded-lg border border-neutral-800 bg-[#0b0b0b]"
                                    >
                                        <button
                                            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-900/40 transition-colors"
                                            onClick={() =>
                                                setExpandedTables((prev) => ({
                                                    ...prev,
                                                    [t.name]: !prev[t.name],
                                                }))
                                            }
                                        >
                                            <span className="flex items-center gap-2 text-sm">
                                                <Table className="w-4 h-4 text-neutral-400" />
                                                <span className="font-medium text-neutral-200">
                                                    {t.name}
                                                </span>
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-neutral-500 transition-transform ${open ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {open && (
                                            <div className="px-3 pb-3 space-y-1">
                                                {t.columns.map((c) => (
                                                    <div
                                                        key={c.name}
                                                        className="flex items-center justify-between text-xs rounded-md px-2 py-1 bg-neutral-900/40 border border-neutral-800"
                                                    >
                                                        <span className="font-mono text-neutral-200">
                                                            {c.name}
                                                        </span>
                                                        <span className="text-neutral-500">
                                                            {c.type}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="pt-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            setSql(
                                                                `select * from ${t.name} limit 100;`
                                                            )
                                                        }
                                                    >
                                                        Générer un SELECT
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Editor + results */}
                    <div className="lg:col-span-9 flex flex-col gap-6">
                        <Card className="border-neutral-800 bg-[#0f0f0f] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Query</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">PostgreSQL</Badge>
                                    <Badge className="bg-indigo-600 text-white">
                                        Read/Write
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="gap-0">
                                <textarea
                                    value={sql}
                                    onChange={(e) => setSql(e.target.value)}
                                    spellCheck={false}
                                    className="min-h-[220px] w-full resize-none rounded-lg border border-neutral-800 bg-[#0b0b0b] p-4 font-mono text-sm text-neutral-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="Écris ta requête SQL ici…"
                                />
                                <div className="flex flex-col gap-2 pt-4">
                                    <div className="text-xs text-neutral-500">
                                        Astuce: <span className="text-neutral-400">Ctrl</span>{" "}
                                        + <span className="text-neutral-400">Enter</span>{" "}
                                        pour exécuter (à brancher).
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            <Card className="xl:col-span-8 border-neutral-800 bg-[#0f0f0f] overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Results</CardTitle>
                                    {result ? (
                                        <span className="text-xs text-neutral-500">
                                            {result.rows.length} row(s) •{" "}
                                            {result.elapsedMs}ms
                                        </span>
                                    ) : (
                                        <span className="text-xs text-neutral-500">
                                            —
                                        </span>
                                    )}
                                </CardHeader>
                                <CardContent className="gap-0">
                                    {!result ? (
                                        <div className="text-sm text-neutral-500 py-10 text-center border border-dashed border-neutral-800 rounded-lg bg-[#0b0b0b]">
                                            Exécute une requête pour afficher les
                                            résultats.
                                        </div>
                                    ) : (
                                        <div className="overflow-auto rounded-lg border border-neutral-800 bg-[#0b0b0b]">
                                            <table className="min-w-full text-sm">
                                                <thead className="sticky top-0 bg-[#111] border-b border-neutral-800">
                                                    <tr>
                                                        {result.columns.map((c) => (
                                                            <th
                                                                key={c}
                                                                className="px-4 py-3 text-left text-xs font-medium text-neutral-400"
                                                            >
                                                                {c}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.rows.map((row, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className="border-b border-neutral-800 hover:bg-neutral-900/40"
                                                        >
                                                            {result.columns.map((c) => (
                                                                <td
                                                                    key={c}
                                                                    className="px-4 py-2 text-neutral-200"
                                                                >
                                                                    {String(
                                                                        row[c] ?? ""
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="xl:col-span-4 border-neutral-800 bg-[#0f0f0f]">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Saved / History
                                    </CardTitle>
                                    <Badge variant="secondary">
                                        {savedQueries.length + history.length}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-neutral-400">
                                            Saved queries
                                        </div>
                                        {savedQueries.slice(0, 6).map((q) => (
                                            <button
                                                key={q.name}
                                                className="w-full text-left rounded-lg border border-neutral-800 bg-[#0b0b0b] px-3 py-2 hover:border-indigo-500/60 transition-colors"
                                                onClick={() => setSql(q.sql)}
                                            >
                                                <div className="text-sm font-medium text-neutral-200">
                                                    {q.name}
                                                </div>
                                                <div className="text-xs text-neutral-500 font-mono line-clamp-1">
                                                    {q.sql}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-medium text-neutral-400">
                                                History
                                            </div>
                                            <History className="w-4 h-4 text-neutral-500" />
                                        </div>
                                        {history.length === 0 ? (
                                            <div className="text-xs text-neutral-500">
                                                Aucune requête exécutée.
                                            </div>
                                        ) : (
                                            history.slice(0, 6).map((h, idx) => (
                                                <button
                                                    key={`${h.at}-${idx}`}
                                                    className="w-full text-left rounded-lg border border-neutral-800 bg-[#0b0b0b] px-3 py-2 hover:border-neutral-700 transition-colors"
                                                    onClick={() => setSql(h.sql)}
                                                >
                                                    <div className="text-xs text-neutral-500">
                                                        {h.at}
                                                    </div>
                                                    <div className="text-xs text-neutral-300 font-mono line-clamp-2">
                                                        {h.sql}
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

