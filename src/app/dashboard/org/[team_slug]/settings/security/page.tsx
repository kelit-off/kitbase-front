"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/useTeam";
import { teamApi } from "@/libs/api/team.api";
import { Shield, Smartphone, Clock } from "lucide-react";

export default function SettingsSecurityPage() {
    const { team_slug } = useParams();
    const { data: team, refetch } = useTeam(team_slug as string);

    // MFA states
    const [mfaRequired, setMfaRequired] = useState(false);
    const [mfaLoading, setMfaLoading] = useState(false);
    const [mfaError, setMfaError] = useState<string | null>(null);
    const [mfaSuccess, setMfaSuccess] = useState(false);

    // Session states
    const [sessionTimeout, setSessionTimeout] = useState("7");
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [sessionSuccess, setSessionSuccess] = useState(false);

    const handleUpdateMfa = async () => {
        setMfaLoading(true);
        setMfaError(null);
        setMfaSuccess(false);

        try {
            await teamApi.updateSecurity(team_slug as string, { mfa_required: mfaRequired });
            setMfaSuccess(true);
            refetch();
            setTimeout(() => setMfaSuccess(false), 3000);
        } catch (err: any) {
            setMfaError(err?.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setMfaLoading(false);
        }
    };

    const handleUpdateSession = async () => {
        setSessionLoading(true);
        setSessionError(null);
        setSessionSuccess(false);

        try {
            await teamApi.updateSecurity(team_slug as string, { session_timeout_days: parseInt(sessionTimeout) });
            setSessionSuccess(true);
            refetch();
            setTimeout(() => setSessionSuccess(false), 3000);
        } catch (err: any) {
            setSessionError(err?.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setSessionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* MFA Requirement */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/20">
                            <Smartphone className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <CardTitle>Authentification à deux facteurs (MFA)</CardTitle>
                            <CardDescription>
                                Exiger l'authentification à deux facteurs pour tous les membres.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-950/50">
                        <div>
                            <h4 className="font-medium text-white">MFA obligatoire</h4>
                            <p className="text-sm text-gray-400 mt-1">
                                Les membres sans MFA activé ne pourront plus accéder à l'organisation.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mfaRequired}
                                onChange={(e) => setMfaRequired(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    {mfaError && (
                        <p className="text-red-400 text-sm mt-2">{mfaError}</p>
                    )}
                    {mfaSuccess && (
                        <p className="text-green-400 text-sm mt-2">Paramètre mis à jour avec succès</p>
                    )}
                </CardContent>
                <CardFooter className="border-t border-gray-800 bg-gray-950/50">
                    <Button
                        onClick={handleUpdateMfa}
                        disabled={mfaLoading}
                    >
                        {mfaLoading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Session Timeout */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                            <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <CardTitle>Expiration des sessions</CardTitle>
                            <CardDescription>
                                Durée avant déconnexion automatique des membres inactifs.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="max-w-xs">
                        <select
                            value={sessionTimeout}
                            onChange={(e) => setSessionTimeout(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="1">1 jour</option>
                            <option value="7">7 jours</option>
                            <option value="14">14 jours</option>
                            <option value="30">30 jours</option>
                            <option value="90">90 jours</option>
                        </select>
                    </div>
                    {sessionError && (
                        <p className="text-red-400 text-sm mt-2">{sessionError}</p>
                    )}
                    {sessionSuccess && (
                        <p className="text-green-400 text-sm mt-2">Paramètre mis à jour avec succès</p>
                    )}
                </CardContent>
                <CardFooter className="border-t border-gray-800 bg-gray-950/50">
                    <Button
                        onClick={handleUpdateSession}
                        disabled={sessionLoading}
                    >
                        {sessionLoading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Security Overview */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                            <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <CardTitle>Aperçu de la sécurité</CardTitle>
                            <CardDescription>
                                État actuel de la sécurité de votre organisation.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-950/50">
                            <span className="text-gray-300">Membres avec MFA activé</span>
                            <span className="text-white font-medium">
                                {team?.users?.filter((u: any) => u.two_factor_confirmed_at).length || 0} / {team?.users?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-950/50">
                            <span className="text-gray-300">Invitations en attente</span>
                            <span className="text-white font-medium">0</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-950/50">
                            <span className="text-gray-300">Sessions actives</span>
                            <span className="text-white font-medium">{team?.users?.length || 0}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
