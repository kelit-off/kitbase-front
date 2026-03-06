export interface DbColumn {
    name: string;
    type: string;
    udt_type: string;
    nullable: boolean;
    is_primary_key: boolean;
    default_value: string | null;
}

export interface DbTable {
    name: string;
    size: string;
    column_count: number;
    row_estimate: number;
}

export type DbRow = Record<string, string | number | boolean | null>;

export interface TableData {
    rows: DbRow[];
    columns: DbColumn[];
    total: number;
    page: number;
    limit: number;
}

export interface QueryResult {
    rows: DbRow[];
    fields: string[];
    rowCount: number;
    duration: number;
    error?: string;
}

export interface DbCredentials {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}
