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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:px-96">
                <h1 className="text-xl">Vos projets</h1>
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
                        <Link href={"/dashboard/new/" + (teamSlug ?? "")} prefetch>
                            <Button>
                                Créer un nouveau projet
                            </Button>
                        </Link>
                    </div>
                </div>
                <div>
                    {/* Liste Card des projets */}
                    {projects && projects.length > 0 ? (
                        projects.map((project: any) => (
                            <Link href={"/dashboard/project/" + project.slug} key={project.slug}>
                                <Card key={project.slug} className="!gap-0 mb-4 p-4 md:min-w-68 md:max-w-68 cursor-pointer hover:bg-muted/50 transition">
                                    <h3 className="text-lg font-semibold mb-0">{project.name}</h3>
                                    <p>{project.region}</p>
                                    {project.compute_instances?.map((instance: any) => (
                                        <Badge key={instance?.id ?? instance?.compute_plan?.name}>
                                            {instance.compute_plan.name}
                                        </Badge>
                                    ))}
                                    {/* idée indique le type de serveur et sa localité */}
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-lg text-center w-full mt-16">
                            Aucune projet disponible.
                        </p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}