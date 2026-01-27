"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/useTeam";
import { teamApi } from "@/libs/api/team.api";

export default function SettingsGeneralPage() {
    const router = useRouter();
    const { team_slug } = useParams();
    const { data: team, refetch } = useTeam(team_slug as string);

    // Form states
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [nameLoading, setNameLoading] = useState(false);
    const [slugLoading, setSlugLoading] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const [slugError, setSlugError] = useState<string | null>(null);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [slugSuccess, setSlugSuccess] = useState(false);

    // Delete states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Initialize form values when team data is loaded
    useState(() => {
        if (team) {
            setName(team.name);
            setSlug(team.slug);
        }
    });

    const handleUpdateName = async () => {
        if (!name.trim() || name === team?.name) return;

        setNameLoading(true);
        setNameError(null);
        setNameSuccess(false);

        try {
            await teamApi.update(team_slug as string, { name: name.trim() });
            setNameSuccess(true);
            refetch();
            setTimeout(() => setNameSuccess(false), 3000);
        } catch (err: any) {
            setNameError(err?.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setNameLoading(false);
        }
    };

    const handleUpdateSlug = async () => {
        if (!slug.trim() || slug === team?.slug) return;

        setSlugLoading(true);
        setSlugError(null);
        setSlugSuccess(false);

        try {
            await teamApi.update(team_slug as string, { slug: slug.trim() });
            setSlugSuccess(true);
            refetch();
            // Redirect to the new slug
            router.push(`/dashboard/org/${slug.trim()}/settings/general`);
        } catch (err: any) {
            setSlugError(err?.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setSlugLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== team?.name) return;

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            await teamApi.delete(team_slug as string);
            router.push("/dashboard");
        } catch (err: any) {
            setDeleteError(err?.response?.data?.message || "Erreur lors de la suppression");
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Organization Name */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle>Organization Name</CardTitle>
                    <CardDescription>
                        Le nom affiché de votre organisation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        value={name || team?.name || ""}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de l'organisation"
                        className="max-w-md bg-gray-950 border-gray-800"
                    />
                    {nameError && (
                        <p className="text-red-400 text-sm mt-2">{nameError}</p>
                    )}
                    {nameSuccess && (
                        <p className="text-green-400 text-sm mt-2">Nom mis à jour avec succès</p>
                    )}
                </CardContent>
                <CardFooter className="border-t border-gray-800 bg-gray-950/50">
                    <Button
                        onClick={handleUpdateName}
                        disabled={nameLoading || !name.trim() || name === team?.name}
                    >
                        {nameLoading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Organization Slug */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle>Organization Slug</CardTitle>
                    <CardDescription>
                        L'identifiant unique utilisé dans les URLs. Uniquement des lettres minuscules, chiffres et tirets.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 max-w-md">
                        <span className="text-gray-500 text-sm">/dashboard/org/</span>
                        <Input
                            value={slug || team?.slug || ""}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="mon-organisation"
                            className="bg-gray-950 border-gray-800"
                        />
                    </div>
                    {slugError && (
                        <p className="text-red-400 text-sm mt-2">{slugError}</p>
                    )}
                    {slugSuccess && (
                        <p className="text-green-400 text-sm mt-2">Slug mis à jour avec succès</p>
                    )}
                </CardContent>
                <CardFooter className="border-t border-gray-800 bg-gray-950/50">
                    <Button
                        onClick={handleUpdateSlug}
                        disabled={slugLoading || !slug.trim() || slug === team?.slug}
                    >
                        {slugLoading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-gray-900 border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-400">Danger Zone</CardTitle>
                    <CardDescription>
                        Actions irréversibles concernant votre organisation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-red-900/30 bg-red-950/20">
                        <div>
                            <h4 className="font-medium text-white">Supprimer cette organisation</h4>
                            <p className="text-sm text-gray-400 mt-1">
                                Cette action est irréversible. Tous les projets et données seront supprimés.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Supprimer
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-xl border border-red-900/50 bg-[#111]">
                        <div className="px-6 py-4 border-b border-gray-800">
                            <h3 className="text-lg font-semibold text-red-400">
                                Supprimer l'organisation
                            </h3>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <p className="text-gray-300">
                                Cette action est <strong className="text-red-400">irréversible</strong>.
                                Tous les projets, bases de données et données associées seront définitivement supprimés.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Pour confirmer, tapez <strong className="text-white">{team?.name}</strong> ci-dessous:
                            </p>
                            <Input
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder={team?.name}
                                className="bg-gray-950 border-gray-800"
                            />
                            {deleteError && (
                                <p className="text-red-400 text-sm">{deleteError}</p>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText("");
                                    setDeleteError(null);
                                }}
                                disabled={deleteLoading}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleteLoading || deleteConfirmText !== team?.name}
                            >
                                {deleteLoading ? "Suppression..." : "Supprimer définitivement"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
