import api from "../api";

export interface Project {
    id: number;
    teamId: number;
    name: string;
    slug: string;
}

export const projectApi = {
    get: (projectSlug: string) => api().get<Project>(`/projects/${projectSlug}`).then(r => r.data),
    list: (teamSlug: string) => api().get<Project[]>(`/projects/team/${teamSlug}`).then(r => r.data),
}