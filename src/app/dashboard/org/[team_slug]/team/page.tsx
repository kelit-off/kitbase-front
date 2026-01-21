"use client";

import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/useTeam";
import DashboardLayout from "@/layout/dashboardLayout";
import { useParams } from "next/navigation";

export default function DashboardTeamMembersPage({ }) {
    const { team_slug } = useParams();

    const { data: team } = useTeam(team_slug as string);
    // TODO: brancher le vrai rôle depuis l'API (ex: team.current_user_role)
    const current_user_role = (team as any)?.current_user_role ?? "admin";

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
                        <Button>Invite member</Button>
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
                                            <td className="px-6 py-4">{member.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                {member.two_factor_confirmed_at ? "✓" : "✕"}
                                            </td>
                                            <td className="px-6 py-4 text-white capitalize">{member.pivot.role}</td>
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
        </DashboardLayout>
    )
}