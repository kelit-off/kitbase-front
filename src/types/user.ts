export type User = {
    id: string;
    name: string;
    email: string;
    role: "owner" | "admin" | "member";
    provider: "google" | "github" | "password";
}