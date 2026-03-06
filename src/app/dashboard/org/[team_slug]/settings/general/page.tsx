"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/useTeam";
import { teamApi } from "@/libs/api/team.api";

export default function SettingsGeneralPage() {
    const router = useRouter();
    const { team_slug } = useParams() as { team_slug: string };
    const { data: team, refetch } = useTeam(team_slug);

    const [name, setName] = useState("");
    const [nameLoading, setNameLoading] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const [nameSuccess, setNameSuccess] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteCountdown, setDeleteCountdown] = useState(0);
    const countdownRunning = useRef(false);

    useEffect(() => {
        if (team) setName(team.name);
    }, [team]);

    useEffect(() => {
        const matches = deleteConfirmText !== "" && deleteConfirmText === team?.name;
        if (matches && !countdownRunning.current) {
            countdownRunning.current = true;
            setDeleteCountdown(3);
            const timer = setInterval(() => {
                setDeleteCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        countdownRunning.current = false;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
        if (!matches) {
            countdownRunning.current = false;
            setDeleteCountdown(0);
        }
    }, [deleteConfirmText, team?.name]);

    const handleUpdateName = async () => {
        if (!name.trim() || name === team?.name) return;
        setNameLoading(true);
        setNameError(null);
        setNameSuccess(false);
        try {
            await teamApi.update(team_slug, { name: name.trim() });
            setNameSuccess(true);
            refetch();
            setTimeout(() => setNameSuccess(false), 3000);
        } catch (err: any) {
            setNameError(err?.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setNameLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== team?.name) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await teamApi.delete(team_slug);
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
                    <CardTitle>Nom de l'organisation</CardTitle>
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

            {/* Danger Zone */}
            <Card className="bg-gray-900 border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-400">Zone dangereuse</CardTitle>
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
                        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
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
                                Pour confirmer, tapez <strong className="text-white">{team?.name}</strong> ci-dessous :
                            </p>
                            <Input
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder={team?.name}
                                className="bg-gray-950 border-gray-800"
                            />
                            {deleteConfirmText === team?.name && deleteCountdown > 0 && (
                                <div className="relative h-1 rounded-full bg-neutral-800 overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-1000 ease-linear"
                                        style={{ width: `${((3 - deleteCountdown) / 3) * 100}%` }}
                                    />
                                </div>
                            )}
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
                                    countdownRunning.current = false;
                                    setDeleteCountdown(0);
                                }}
                                disabled={deleteLoading}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleteLoading || deleteConfirmText !== team?.name || deleteCountdown > 0}
                            >
                                {deleteCountdown > 0
                                    ? `Attendez ${deleteCountdown}s…`
                                    : deleteLoading
                                    ? "Suppression..."
                                    : "Supprimer définitivement"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
