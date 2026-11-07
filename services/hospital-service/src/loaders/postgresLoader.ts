import pg from "pg";
const { Pool } = pg;
let pool: pg.Pool;

export function getPool(): pg.Pool {
    if (!pool) {
        throw new Error("Database has not been initialized");
    }

    return pool;
}

export async function connectDatabase(): Promise<void> {
    const { DATABASE_URL } = process.env;

    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is not configured");
    }

    pool = new Pool({
        connectionString: DATABASE_URL,

        // Pool configuration
        max: 20,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 2_000,
    });

    try {
        await pool.query("SELECT 1");

        console.log("Database connection successful");
    } catch (error) {
        console.error("Failed to connect to database:", error);

        await pool.end();

        process.exit(1);
    }
}