import { Pool } from "pg";
import { DbCredentials } from "@/types/database";

// Module-level pool cache: keyed by project slug.
// Persists across requests in the same Node.js process.
const poolCache = new Map<string, { pool: Pool; expiresAt: number }>();
const POOL_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getCredentials(projectSlug: string, authToken: string): Promise<DbCredentials> {
    const apiUrl =
        process.env.INTERNAL_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:3001";

    const res = await fetch(`${apiUrl}/projects/${projectSlug}/credentials`, {
        headers: { Authorization: `Bearer ${authToken}` },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Impossible de récupérer les credentials: ${res.status} — ${text}`);
    }

    return res.json();
}

async function createPool(projectSlug: string, authToken: string): Promise<Pool> {
    const creds = await getCredentials(projectSlug, authToken);

    const pool = new Pool({
        host: creds.host,
        port: creds.port,
        database: creds.database,
        user: creds.user,
        password: creds.password,
        ssl: process.env.DB_SSL !== "false" ? { rejectUnauthorized: false } : false,
        max: 3,
        idleTimeoutMillis: 60_000,
        connectionTimeoutMillis: 10_000,
    });

    pool.on("error", () => {
        poolCache.delete(projectSlug);
    });

    return pool;
}

export async function getPool(projectSlug: string, authToken: string): Promise<Pool> {
    const cached = poolCache.get(projectSlug);

    if (cached && cached.expiresAt > Date.now()) {
        return cached.pool;
    }

    // End the old pool gracefully
    if (cached) {
        cached.pool.end().catch(() => {});
    }

    const pool = await createPool(projectSlug, authToken);
    poolCache.set(projectSlug, { pool, expiresAt: Date.now() + POOL_TTL_MS });
    return pool;
}

export async function dbQuery(
    projectSlug: string,
    authToken: string,
    sql: string,
    params?: unknown[]
): Promise<{
    rows: Record<string, unknown>[];
    fields: string[];
    rowCount: number;
    duration: number;
}> {
    const pool = await getPool(projectSlug, authToken);
    const t0 = performance.now();
    const result = await pool.query(sql, params as any[]);
    const duration = Math.round(performance.now() - t0);

    return {
        rows: result.rows,
        fields: result.fields?.map((f) => f.name) ?? [],
        rowCount: result.rowCount ?? 0,
        duration,
    };
}
