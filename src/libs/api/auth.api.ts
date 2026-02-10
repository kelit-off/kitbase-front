import api from "../api";

export const authApi = {
    login: (data: { email: string; password: string }) =>
        api().post<{ success: boolean }>("/auth/login", data).then(r => r.data),

    register: (data: { email: string; name: string; password: string }) =>
        api().post<{ success: boolean }>("/auth/register", data).then(r => r.data),

    forgotPassword: (data: { email: string }) =>
        api().post<{ success: boolean }>("/auth/reset-password", data).then(r => r.data),

    resetPassword: (data: { token: string; newPassword: string }) =>
        api().post<{ success: boolean }>("/auth/reset-password/code", data).then(r => r.data),

    me: () =>
        api().get("/auth/me").then(r => r.data),

    logout: () =>
        api().post("/auth/logout").then(r => r.data),
};
