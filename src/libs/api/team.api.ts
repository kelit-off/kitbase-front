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
}