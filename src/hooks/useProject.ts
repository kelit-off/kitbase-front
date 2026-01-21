import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { projectApi, Project } from "@/libs/api/project.api";

/* ================================
   Query keys centralisés
================================ */
export const projectKeys = {
    all: (teamSlug: string) => ["teams", teamSlug, "projects"] as const,
    one: (teamSlug: string, projectSlug: string) =>
        ["teams", teamSlug, "projects", projectSlug] as const,
};

/* ================================
   Projet unique
================================ */

type UseProjectParams =
  | { projectSlug: string; teamSlug?: never }
  | { teamSlug: string; projectSlug?: never };

export function useProject(
    params: UseProjectParams,
    options?: UseQueryOptions<Project | Project[]>,
) {
    const isProject = "projectSlug" in params;

    return useQuery<Project | Project[]>({
        queryKey: isProject
            ? ["projects", params.projectSlug]
            : ["teams", params.teamSlug, "projects"],
        queryFn: () =>
            isProject
                ? projectApi.get((params as any).projectSlug!)
                : projectApi.list((params as any).teamSlug!),
        enabled:
            (options?.enabled ?? true) &&
            (isProject ? !!params.projectSlug : !!params.teamSlug),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}

/* ================================
   Liste des projets
================================ */
export function useProjects(
    teamSlug: string,
    options?: UseQueryOptions<Project[]>,
) {
    return useQuery<Project[]>({
        queryKey: projectKeys.all(teamSlug),
        queryFn: () => projectApi.list(teamSlug),
        enabled: !!teamSlug && (options?.enabled ?? true),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}
