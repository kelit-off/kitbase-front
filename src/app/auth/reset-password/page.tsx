"use client";

import AuthLayout from "@/layout/authLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, Database, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/libs/api/auth.api";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [processing, setProcessing] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError("");

        if (!email.includes("@")) {
            setError("Adresse email invalide");
            setProcessing(false);
            return;
        }

        try {
            await authApi.forgotPassword({ email });
            setSent(true);
        } catch (err: unknown) {
            const error = err as { response?: { status?: number } };
            if (error.response?.status === 429) {
                setError("Trop de tentatives. Veuillez réessayer plus tard.");
            } else {
                // Always show success to prevent email enumeration
                setSent(true);
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
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la connexion
                </Link>

                {sent ? (
                    /* Success state */
                    <div className="space-y-6 text-center">
                        <div className="mx-auto w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Email envoyé !
                            </h1>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                                Si un compte existe avec l&apos;adresse <span className="font-medium text-foreground">{email}</span>, vous recevrez un lien de réinitialisation par email.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Link href="/auth/reset-password/code">
                                <Button
                                    className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                                >
                                    J&apos;ai reçu mon code
                                </Button>
                            </Link>
                            <button
                                onClick={() => { setSent(false); setEmail(""); }}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Renvoyer l&apos;email
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Form state */
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Mot de passe oublié ?
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Entrez votre adresse email et nous vous enverrons un lien de réinitialisation
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

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nom@exemple.com"
                                        className="pl-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    "Envoyer le lien"
                                )}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
