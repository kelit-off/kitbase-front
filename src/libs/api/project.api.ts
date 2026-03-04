import api from "../api";

export interface ComputerPlan {
    id: number;
    code: string;
    name: string;
    sharedCpu: boolean;
    cpuCores: number | null;
    memoryMb: number;
    storageMb: number;
    pricePerMonth: number;
    public: boolean;
}

export interface ComputerInstance {
    id: number;
    slug: string;
    role: "primary" | "replica" | "analytics";
    status: "PENDING" | "PROVISIONING" | "RUNNING" | "SUSPENDED" | "FAILED";
    port: number;
    dbUser: string;
    retryCount: number;
    computerPlan: ComputerPlan;
    createdAt: string;
    updatedAt: string;
}

export interface Database {
    id: number;
    projectId: number;
    computerInstanceId: number | null;
    name: string;
    username: string;
    role: string;
    port: number;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: number;
    teamId: number;
    name: string;
    slug: string;
    host: string | null;
    region: string;
    computerInstances: ComputerInstance[];
    databases: Database[];
    createdAt: string;
    updatedAt: string;
}

export const projectApi = {
    get: (projectSlug: string) =>
        api().get<Project>(`/projects/${projectSlug}`).then(r => r.data),
    list: (teamSlug: string) =>
        api().get<Project[]>(`/projects/team/${teamSlug}`).then(r => r.data),
    create: (data: { team_slug: string; name: string; password: string; region: string }) =>
        api().post<Project>("/projects", data).then(r => r.data),
    update: (projectSlug: string, data: { name: string }) =>
        api().put<Project>(`/projects/${projectSlug}`, data).then(r => r.data),
    delete: (projectSlug: string) =>
        api().delete(`/projects/${projectSlug}`).then(r => r.data),
};
