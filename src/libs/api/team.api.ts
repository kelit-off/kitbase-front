import { User } from "@/types/user";
import api from "../api";

export interface Team {
    id: number;
    name: string;
    slug: string;
    owner_id: string;
    users: User[];
}

export const teamApi = {
    get: (teamSlug: string) => api().get<Team>(`/teams/${teamSlug}`).then(r => r.data),
    list: () => api().get<Team[]>(`/teams`).then(r => r.data),
    invite: (teamSlug: string, email: string, role?: string) =>
        api().post(`/teams/${teamSlug}/invite`, { email, role }).then(r => r.data),
    acceptInvite: (token: string) =>
        api().post(`/teams/invite/${token}/accept`).then(r => r.data),
    update: (teamSlug: string, data: { name?: string; slug?: string }) =>
        api().patch<Team>(`/teams/${teamSlug}`, data).then(r => r.data),
    delete: (teamSlug: string) =>
        api().delete(`/teams/${teamSlug}`).then(r => r.data),
    updateSecurity: (teamSlug: string, data: { mfa_required?: boolean; session_timeout_days?: number }) =>
        api().patch(`/teams/${teamSlug}/security`, data).then(r => r.data),
}