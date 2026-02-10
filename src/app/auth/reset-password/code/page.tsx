"use client";

import AuthLayout from "@/layout/authLayout";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Eye, EyeOff, ArrowLeft, Database, CheckCircle2, KeyRound, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/libs/api/auth.api";

export default function ResetPasswordCode() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState(searchParams.get("token") || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const passwordChecks = useMemo(() => ({
        length: newPassword.length >= 8,
        match: newPassword.length > 0 && newPassword === confirmPassword,
    }), [newPassword, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError("");

        if (!token.trim()) {
            setError("Le code de réinitialisation est requis");
            setProcessing(false);
            return;
        }

        if (newPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            setProcessing(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setProcessing(false);
            return;
        }

        try {
            await authApi.resetPassword({ token, newPassword });
            setSuccess(true);
        } catch (err: unknown) {
            const error = err as { response?: { status?: number; data?: { message?: string } } };
            if (error.response?.status === 400 || error.response?.status === 404) {
                setError("Code de réinitialisation invalide ou expiré");
            } else if (error.response?.status === 429) {
                setError("Trop de tentatives. Veuillez réessayer plus tard.");
            } else {
                setError(error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setProcessing(false);
        }
    };

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

                {/* Back link */}
                <Link
                    href="/auth/reset-password"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>

                {success ? (
                    /* Success state */
                    <div className="space-y-6 text-center">
                        <div className="mx-auto w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Mot de passe modifié !
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Votre mot de passe a été réinitialisé avec succès.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push("/auth/login")}
                            className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                        >
                            Se connecter
                        </Button>
                    </div>
                ) : (
                    /* Form state */
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Nouveau mot de passe
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Entrez le code reçu par email et votre nouveau mot de passe
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Token */}
                            <div className="space-y-2">
                                <Label htmlFor="token" className="text-sm font-medium">Code de réinitialisation</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        id="token"
                                        type="text"
                                        placeholder="Collez votre code ici"
                                        className="pl-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors font-mono text-sm"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* New password */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-medium">Nouveau mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                                    >
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password checks */}
                            {newPassword.length > 0 && (
                                <div className="space-y-1.5 px-1">
                                    {[
                                        { check: passwordChecks.length, label: "Au moins 8 caractères" },
                                        { check: passwordChecks.match, label: "Les mots de passe correspondent" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-2 text-xs">
                                            {item.check ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            ) : (
                                                <X className="w-3.5 h-3.5 text-zinc-400" />
                                            )}
                                            <span className={item.check ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Réinitialisation...
                                    </>
                                ) : (
                                    "Réinitialiser le mot de passe"
                                )}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
