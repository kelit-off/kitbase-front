"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTeam } from "@/hooks/useTeam";
import { teamApi } from "@/libs/api/team.api";
import DashboardLayout from "@/layout/dashboardLayout";
import { useParams } from "next/navigation";
import { X } from "lucide-react";

export default function DashboardTeamMembersPage({ }) {
    const { team_slug } = useParams();

    const { data: team, refetch } = useTeam(team_slug as string);
    // TODO: brancher le vrai rôle depuis l'API (ex: team.current_user_role)
    const current_user_role = (team as any)?.current_user_role ?? "admin";

    // Modal d'invitation
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSuccess, setInviteSuccess] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail.trim() || !team?.id) return;

        setInviteLoading(true);
        setInviteError(null);
        setInviteSuccess(false);

        try {
            await teamApi.invite(team_slug, inviteEmail.trim(), inviteRole);
            setInviteSuccess(true);
            setInviteEmail("");
            setInviteRole("member");
            refetch();
            setTimeout(() => {
                setShowInviteModal(false);
                setInviteSuccess(false);
            }, 1500);
        } catch (err: any) {
            setInviteError(err?.response?.data?.message || "Erreur lors de l'envoi de l'invitation");
        } finally {
            setInviteLoading(false);
        }
    };

    const openInviteModal = () => {
        setInviteEmail("");
        setInviteRole("member");
        setInviteError(null);
        setInviteSuccess(false);
        setShowInviteModal(true);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl w-full mx-auto py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-white">
                        Team
                    </h1>

                    <div className="flex gap-2">
                        <Button variant="secondary">Docs</Button>
                        <Button onClick={openInviteModal}>Inviter un membre</Button>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-800 text-gray-400">
                            <tr>
                                <th className="text-left px-6 py-3 font-medium">
                                    User
                                </th>
                                <th className="text-center px-6 py-3 font-medium">
                                    Enabled MFA
                                </th>
                                <th className="text-left px-6 py-3 font-medium">
                                    Role
                                </th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>

                        <tbody>
                            {team?.users?.length ? (
                                team.users.map((member: any) => {
                                    const canEditRole =
                                        (current_user_role === "owner" || current_user_role === "admin") &&
                                        !member.is_you &&
                                        member.role !== "owner";

                                    const canLeaveTeam =
                                        member.is_you &&
                                        current_user_role !== "owner";

                                    return (
                                        <tr key={member.id} className="border-b border-gray-800 last:border-0">
                                            <td className="px-6 py-4">{member.user.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                {member.two_factor_confirmed_at ? "✓" : "✕"}
                                            </td>
                                            <td className="px-6 py-4 text-white capitalize">{member.role}</td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                {canEditRole && (
                                                    <button className="text-sm text-blue-400 hover:text-blue-300">
                                                        Modifier
                                                    </button>
                                                )}

                                                {canLeaveTeam && (
                                                    <button className="text-sm text-red-400 hover:text-red-300">
                                                        Quitter l’équipe
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-gray-400 italic"
                                    >
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="px-6 py-3 text-sm text-gray-400">
                        {team?.users?.length} user(s)
                    </div>
                </div>
            </div>

            {/* Modal d'invitation */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-[#111]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                            <div className="space-y-1">
                                <div className="text-lg font-semibold">Inviter un membre</div>
                                <div className="text-sm text-neutral-400">
                                    Envoyez une invitation par email
                                </div>
                            </div>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="p-2 rounded-lg hover:bg-neutral-900/60"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {inviteSuccess ? (
                                <div className="text-center py-4">
                                    <div className="text-green-400 text-lg font-medium">
                                        Invitation envoyée !
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="exemple@email.com"
                                            className="bg-[#0b0b0b] border-neutral-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Rôle</label>
                                        <select
                                            value={inviteRole}
                                            onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
                                            className="w-full px-3 py-2 rounded-md bg-[#0b0b0b] border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="member">Membre</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                    </div>

                                    {inviteError && (
                                        <div className="text-red-400 text-sm">
                                            {inviteError}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {!inviteSuccess && (
                            <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowInviteModal(false)}
                                    disabled={inviteLoading}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleInvite}
                                    disabled={inviteLoading || !inviteEmail.trim()}
                                >
                                    {inviteLoading ? "Envoi..." : "Envoyer l'invitation"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}