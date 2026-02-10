"use client";

import AuthLayout from "@/layout/authLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Database, CheckCircle2, XCircle, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { teamApi } from "@/libs/api/team.api";

export default function AcceptInvite() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [teamName, setTeamName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAccept = async () => {
        setStatus("loading");
        try {
            const result = await teamApi.acceptInvite(token);
            setTeamName(result.team?.name || "");
            setStatus("success");
        } catch (err: unknown) {
            const error = err as { response?: { status?: number; data?: { message?: string } } };
            if (error.response?.status === 400) {
                setErrorMessage("Cette invitation est invalide ou a expiré.");
            } else if (error.response?.status === 401) {
                setErrorMessage("Vous devez être connecté pour accepter cette invitation.");
            } else if (error.response?.status === 409) {
                setErrorMessage("Vous êtes déjà membre de cette équipe.");
            } else {
                setErrorMessage(error.response?.data?.message || "Une erreur est survenue.");
            }
            setStatus("error");
        }
    };

    useEffect(() => {
        // Auto-accept on page load if token is present
        if (token) {
            handleAccept();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <AuthLayout>
            <div className="space-y-8">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center justify-center gap-2.5 mb-4">
                    <div className="w-9 h-9 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-xl font-bold text-foreground tracking-tight">Kitbase</span>
                </div>

                <div className="text-center space-y-6">
                    {status === "loading" && (
                        <>
                            <div className="mx-auto w-14 h-14 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center">
                                <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Acceptation en cours...
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Nous traitons votre invitation
                                </p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="mx-auto w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Bienvenue dans l&apos;équipe !
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Vous avez rejoint{teamName ? ` l'équipe ${teamName}` : " l'équipe"} avec succès.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                            >
                                <Users className="w-4 h-4" />
                                Accéder au dashboard
                            </Button>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center">
                                <XCircle className="w-7 h-7 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Invitation invalide
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {errorMessage}
                                </p>
                            </div>
                            <div className="space-y-3">
                                {errorMessage.includes("connecté") && (
                                    <Button
                                        onClick={() => router.push("/auth/login")}
                                        className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                                    >
                                        Se connecter
                                    </Button>
                                )}
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    variant="outline"
                                    className="w-full h-11 rounded-xl"
                                >
                                    Retour au dashboard
                                </Button>
                            </div>
                        </>
                    )}

                    {status === "idle" && (
                        <>
                            <div className="mx-auto w-14 h-14 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Invitation d&apos;équipe
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Vous avez été invité à rejoindre une équipe sur Kitbase
                                </p>
                            </div>
                            <Button
                                onClick={handleAccept}
                                className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                            >
                                Accepter l&apos;invitation
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}
