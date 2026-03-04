"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProject } from "@/hooks/useProject";
import DashboardLayout from "@/layout/dashboardLayout";
import { projectApi } from "@/libs/api/project.api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectSettingsPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const projectSlug = Array.isArray(params.project_slug)
        ? params.project_slug[0]
        : (params.project_slug as string | undefined);

    const { data, isLoading } = useProject({ projectSlug } as any);
    const project = Array.isArray(data) ? data[0] : data;

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        if (project?.name) setName(project.name);
    }, [project?.name]);

    const handleRename = async () => {
        if (!projectSlug || !name.trim() || name === project?.name) return;
        setSaving(true);
        setSaveError("");
        setSaveSuccess(false);
        try {
            await projectApi.update(projectSlug, { name: name.trim() });
            await queryClient.invalidateQueries({ queryKey: ["project", projectSlug] });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err: any) {
            setSaveError(err?.response?.data?.message ?? "Erreur lors de la mise à jour.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!projectSlug || deleteConfirm !== project?.name) return;
        setDeleting(true);
        setDeleteError("");
        try {
            await projectApi.delete(projectSlug);
            queryClient.removeQueries({ queryKey: ["project", projectSlug] });
            router.push("/dashboard");
        } catch (err: any) {
            setDeleteError(err?.response?.data?.message ?? "Erreur lors de la suppression.");
            setDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout className="px-8 py-6 space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
                <div className="h-40 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse" />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout className="px-8 py-6 space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-semibold">Paramètres du projet</h1>
                <p className="text-sm text-neutral-400 mt-1">{project?.name}</p>
            </div>

            {/* Rename */}
            <Card>
                <CardHeader>
                    <CardTitle>Nom du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-name">Nom</Label>
                        <Input
                            id="project-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nom du projet"
                            className="max-w-sm"
                        />
                    </div>
                    {saveError && (
                        <p className="text-sm text-red-400">{saveError}</p>
                    )}
                    {saveSuccess && (
                        <p className="text-sm text-emerald-400">Nom mis à jour.</p>
                    )}
                    <Button
                        onClick={handleRename}
                        disabled={saving || !name.trim() || name === project?.name}
                    >
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Enregistrer
                    </Button>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-900/60">
                <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Zone dangereuse
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-neutral-300 font-medium">Supprimer ce projet</p>
                        <p className="text-sm text-neutral-500 mt-1">
                            Cette action est irréversible. Toutes les bases de données et instances seront supprimées.
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Supprimer le projet
                    </Button>
                </CardContent>
            </Card>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-xl border border-red-900/60 bg-[#111] p-6 space-y-5">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Supprimer le projet</h3>
                            <p className="text-sm text-neutral-400 mt-2">
                                Cette action est irréversible. Tapez le nom du projet{" "}
                                <strong className="text-white">{project?.name}</strong>{" "}
                                pour confirmer.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="delete-confirm">Nom du projet</Label>
                            <Input
                                id="delete-confirm"
                                value={deleteConfirm}
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                placeholder={project?.name}
                            />
                        </div>

                        {deleteError && (
                            <p className="text-sm text-red-400">{deleteError}</p>
                        )}

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirm("");
                                    setDeleteError("");
                                }}
                                disabled={deleting}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleting || deleteConfirm !== project?.name}
                            >
                                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Supprimer définitivement
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
