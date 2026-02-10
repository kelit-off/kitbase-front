"use client";

import React from 'react';
import { Database, Zap, Shield, Clock, BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex bg-zinc-950">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                {/* Animated gradient mesh */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
                    <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                </div>

                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

                {/* Radial vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Database className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Kitbase</span>
                    </div>

                    {/* Hero */}
                    <div className="space-y-8 max-w-lg">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                Database-as-a-Service
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] text-white tracking-tight">
                                Vos bases de données,{' '}
                                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                    simplifiées
                                </span>
                            </h1>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Déployez, gérez et scalez vos bases de données en quelques clics. PostgreSQL, MySQL, Redis et plus encore.
                            </p>
                        </div>

                        {/* Feature pills */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Zap, label: 'Déploiement en 30s', color: 'amber' },
                                { icon: Shield, label: 'Backups automatiques', color: 'emerald' },
                                { icon: BarChart3, label: 'Monitoring temps réel', color: 'cyan' },
                                { icon: Clock, label: 'Scaling automatique', color: 'violet' },
                            ].map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
                                >
                                    <feature.icon className={`w-4 h-4 shrink-0 ${
                                        feature.color === 'amber' ? 'text-amber-400' :
                                        feature.color === 'emerald' ? 'text-emerald-400' :
                                        feature.color === 'cyan' ? 'text-cyan-400' :
                                        'text-violet-400'
                                    }`} />
                                    <span className="text-sm text-zinc-300 font-medium">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm max-w-lg">
                        <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            &ldquo;Kitbase nous a permis de réduire nos coûts d&apos;infrastructure de 60% tout en améliorant la fiabilité de nos bases de données.&rdquo;
                        </p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                                TL
                            </div>
                            <div>
                                <p className="font-medium text-white text-sm">Thomas Lefebvre</p>
                                <p className="text-xs text-zinc-500">CTO, DataFlow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900 p-6 lg:p-12 lg:rounded-l-[2rem]">
                <div className="w-full max-w-[420px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
