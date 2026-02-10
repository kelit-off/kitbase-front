"use client";

import AuthLayout from "@/layout/authLayout";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff, User, Database, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/libs/api/auth.api";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const passwordChecks = useMemo(() => ({
        length: password.length >= 8,
        match: password.length > 0 && password === passwordConfirm,
    }), [password, passwordConfirm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = "Le nom est requis";
        }

        if (!email.includes("@")) {
            newErrors.email = "Adresse email invalide";
        }

        if (password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }

        if (password !== passwordConfirm) {
            newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }

        try {
            await authApi.register({ email, name, password });
            router.push("/dashboard");
        } catch (err: unknown) {
            const error = err as { response?: { status?: number; data?: { message?: string } } };
            if (error.response?.status === 409) {
                setErrors({ email: "Cette adresse email est déjà utilisée" });
            } else if (error.response?.status === 429) {
                setErrors({ general: "Trop de tentatives. Veuillez réessayer plus tard." });
            } else {
                setErrors({ general: error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer." });
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

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Créer un compte
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Rejoignez-nous et commencez à gérer vos bases de données
                    </p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => (window.location.href = `${API_URL}/auth/google`)}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all duration-200 text-sm font-medium text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={() => (window.location.href = `${API_URL}/auth/github`)}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all duration-200 text-sm font-medium text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                {/* Separator */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-zinc-900 px-3 text-muted-foreground font-medium">
                            ou par email
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.general}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Nom complet</Label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jean Dupont"
                                className="pl-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                aria-invalid={!!errors.name}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs font-medium">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
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
                                aria-invalid={!!errors.email}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs font-medium">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs font-medium">{errors.password}</p>
                        )}
                    </div>

                    {/* Password confirmation */}
                    <div className="space-y-2">
                        <Label htmlFor="passwordConfirm" className="text-sm font-medium">Confirmer le mot de passe</Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <Input
                                id="passwordConfirm"
                                type={showPasswordConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-colors"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                aria-invalid={!!errors.passwordConfirm}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                            >
                                {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.passwordConfirm && (
                            <p className="text-red-500 text-xs font-medium">{errors.passwordConfirm}</p>
                        )}
                    </div>

                    {/* Password strength hints */}
                    {password.length > 0 && (
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

                    {/* Terms */}
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                        En créant un compte, vous acceptez nos{" "}
                        <Link href="/terms" className="text-indigo-500 dark:text-indigo-400 hover:underline">
                            conditions d&apos;utilisation
                        </Link>{" "}
                        et notre{" "}
                        <Link href="/privacy" className="text-indigo-500 dark:text-indigo-400 hover:underline">
                            politique de confidentialité
                        </Link>
                    </p>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Création en cours...
                            </>
                        ) : (
                            "Créer mon compte"
                        )}
                    </Button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-muted-foreground">
                    Déjà un compte ?{" "}
                    <Link href="/auth/login" className="text-indigo-500 dark:text-indigo-400 font-medium hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
