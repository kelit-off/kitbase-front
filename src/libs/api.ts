import axios from "axios";

export default function api() {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    })

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

    return instance;
}