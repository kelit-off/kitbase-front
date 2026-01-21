"use client";

import DashboardLayout from "@/layout/dashboardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTeams } from "@/hooks/useTeam";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
    const { data: teams } = useTeams();

    return (
        <DashboardLayout>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:px-96">
                <h1 className='text-xl'>Vos organisations</h1>
                <div className='flex flex-row justify-between'>
                    {/* Petite bar de recherche et bouton pour crée nouvelle orga */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Rechercher une organisation..."
                            className="px-4 py-2 border border-sidebar-border/70 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Link href="/dashboard/new" prefetch>
                            <Button>
                                Créer une nouvelle organisation
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    {teams && teams.length > 0 ? (
                        teams.map((team: any) => (
                            <Link key={team.id} href={`/dashboard/org/${team.slug}`}>
                                <Card className="mb-4 p-4 md:min-w-68 md:max-w-68 cursor-pointer hover:bg-muted/50 transition">
                                    <h3 className="text-lg font-semibold">{team.name}</h3>
                                    <div className="flex flex-row items-center gap-2 text-muted-200 text-sm">
                                        <span>
                                            {team.pricingPlan.name.charAt(0).toUpperCase() +
                                                team.pricingPlan.name.slice(1)}{" "}
                                            Plan
                                        </span>
                                        <p>
                                            {team._count.projects} projet
                                            {team._count.projects > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-lg text-center w-full mt-16">
                            Aucune organisation disponible.
                        </p>
                    )}
                </div>

            </div>
        </DashboardLayout>
    )
}

