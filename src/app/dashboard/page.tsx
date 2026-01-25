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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-8 max-w-6xl mx-auto w-full">
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
                {teams && teams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map((team: any) => (
                            <Link key={team.id} href={`/dashboard/org/${team.slug}`} className="block">
                                <Card className="p-4 h-full cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
                                    <h3 className="text-lg font-semibold">{team.name}</h3>
                                    <div className="flex flex-row items-center gap-2 text-muted-foreground text-sm mt-1">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                                            {team.pricingPlan.name.charAt(0).toUpperCase() +
                                                team.pricingPlan.name.slice(1)}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {team._count.projects} projet
                                            {team._count.projects > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-lg text-center w-full mt-16">
                        Aucune organisation disponible.
                    </p>
                )}

            </div>
        </DashboardLayout>
    )
}

