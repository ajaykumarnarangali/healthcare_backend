import { getPool } from "../loaders/init.js";

export async function exists(eventId: string): Promise<boolean> {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT 1
        FROM processed_events
        WHERE event_id = $1
        LIMIT 1
        `,
        [eventId]
    );

    return (result.rowCount ?? 0) > 0;
}

export async function markAsProcessed(eventId: string): Promise<void> {
    const pool = getPool();

    await pool.query(
        `
        INSERT INTO processed_events (event_id)
        VALUES ($1)
        `,
        [eventId]
    );
}