"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProject";
import DashboardLayout from "@/layout/dashboardLayout";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TeamDashboardPage() {
    const { team_slug: team_slug } = useParams();

    const teamSlug = Array.isArray(team_slug)
        ? team_slug[0]
        : (team_slug as string | undefined);

    const { data: projects } = useProjects(teamSlug ?? "");
    return (
        <DashboardLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-8 max-w-6xl mx-auto w-full">
                <h1 className="text-xl">Vos projets</h1>
                <div className="flex flex-row justify-between">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Rechercher un projet..."
                            className="px-4 py-2 border border-sidebar-border/70 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Link href={"/dashboard/new/" + (teamSlug ?? "")} prefetch>
                            <Button>
                                Créer un nouveau projet
                            </Button>
                        </Link>
                    </div>
                </div>
                {projects && projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project: any) => (
                            <Link href={"/dashboard/project/" + project.slug} key={project.slug} className="block">
                                <Card className="p-4 h-full cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
                                    <h3 className="text-lg font-semibold">{project.name}</h3>
                                    <p className="text-muted-foreground text-sm">{project.region}</p>
                                    {project.computerInstances?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.computerInstances.map((instance: any) => (
                                                <Badge key={instance?.id ?? instance?.compute_plan?.name} variant="secondary">
                                                    {instance.computerPlan.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-lg text-center w-full mt-16">
                        Aucun projet disponible.
                    </p>
                )}
            </div>
        </DashboardLayout>
    )
}